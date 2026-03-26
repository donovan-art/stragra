import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Document } from "../types";
import { 
  parseApiError, 
  retryWithBackoff, 
  withTimeout
} from "./errors";

const API_BASE = "/api";
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Get current tenant from auth context - placeholder for now
const getTenantId = () => "default-tenant";

// ============================================================================
// Error Handling Wrapper
// ============================================================================

/**
 * Wraps an API call with standardized error handling
 */
async function apiCall<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: { timeout?: number; retries?: number } = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = 2 } = options;

  try {
    return await retryWithBackoff(
      () => withTimeout(operation(), timeout),
      retries
    );
  } catch (error) {
    const apiError = parseApiError(error);
    console.error(`[API Error] ${operationName}:`, apiError);
    throw error;
  }
}

// ============================================================================
// Documents API
// ============================================================================

const documentsApi = {
  list: async (parentId: string | null = null): Promise<Document[]> => {
    return apiCall(async () => {
      const params = new URLSearchParams();
      if (parentId) params.append("parentId", parentId);
      params.append("tenantId", getTenantId());
      
      const { data } = await axios.get(`${API_BASE}/documents?${params}`);
      
      // Validate response data
      if (!Array.isArray(data)) {
        throw new Error("Invalid response: expected array of documents");
      }
      
      return data;
    }, "list documents");
  },

  createFolder: async (name: string, parentId: string | null = null): Promise<Document> => {
    return apiCall(async () => {
      const { data } = await axios.post(`${API_BASE}/documents/folder`, {
        name,
        parentId,
        tenantId: getTenantId(),
      });
      return data;
    }, "create folder");
  },

  upload: async (
    file: File, 
    parentId: string | null = null, 
    onProgress?: (progress: number) => void
  ): Promise<Document> => {
    return apiCall(async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantId", getTenantId());
      if (parentId) formData.append("parentId", parentId);

      const { data } = await axios.post(`${API_BASE}/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
        timeout: 300000, // 5 minutes for file uploads
      });
      return data;
    }, "upload file", { timeout: 300000 });
  },

  download: async (documentId: string): Promise<Blob> => {
    return apiCall(async () => {
      const { data } = await axios.get(`${API_BASE}/documents/${documentId}/download`, {
        params: { tenantId: getTenantId() },
        responseType: "blob",
      });
      return data;
    }, "download file");
  },

  preview: async (documentId: string): Promise<string> => {
    return apiCall(async () => {
      const { data } = await axios.get(`${API_BASE}/documents/${documentId}/preview`, {
        params: { tenantId: getTenantId() },
      });
      return data.url;
    }, "preview file");
  },

  rename: async (documentId: string, name: string): Promise<Document> => {
    return apiCall(async () => {
      const { data } = await axios.patch(`${API_BASE}/documents/${documentId}`, {
        name,
        tenantId: getTenantId(),
      });
      return data;
    }, "rename document");
  },

  move: async (documentId: string, parentId: string | null): Promise<Document> => {
    return apiCall(async () => {
      const { data } = await axios.patch(`${API_BASE}/documents/${documentId}/move`, {
        parentId,
        tenantId: getTenantId(),
      });
      return data;
    }, "move document");
  },

  delete: async (documentId: string, permanent: boolean = false): Promise<void> => {
    return apiCall(async () => {
      await axios.delete(`${API_BASE}/documents/${documentId}`, {
        params: { tenantId: getTenantId(), permanent },
      });
    }, "delete document");
  },

  restore: async (documentId: string): Promise<Document> => {
    return apiCall(async () => {
      const { data } = await axios.post(`${API_BASE}/documents/${documentId}/restore`, {
        tenantId: getTenantId(),
      });
      return data;
    }, "restore document");
  },

  share: async (documentId: string, expiresInHours?: number): Promise<{ token: string; url: string }> => {
    return apiCall(async () => {
      const { data } = await axios.post(`${API_BASE}/documents/${documentId}/share`, {
        tenantId: getTenantId(),
        expiresInHours,
      });
      return data;
    }, "share document");
  },

  getBreadcrumbs: async (folderId: string | null): Promise<Array<{ id: string | null; name: string }>> => {
    return apiCall(async () => {
      if (!folderId) return [{ id: null, name: "Home" }];
      
      const { data } = await axios.get(`${API_BASE}/documents/${folderId}/breadcrumbs`, {
        params: { tenantId: getTenantId() },
      });
      
      // Validate response
      if (!Array.isArray(data)) {
        console.warn("Invalid breadcrumbs response, using default");
        return [{ id: folderId, name: "Folder" }];
      }
      
      return data;
    }, "get breadcrumbs");
  },
};

// ============================================================================
// React Query Hooks with Error Handling
// ============================================================================

// Retry function that determines if we should retry based on error type
const shouldRetry = (failureCount: number, error: AxiosError): boolean => {
  const apiError = parseApiError(error);
  // Only retry network errors and 5xx server errors
  if (!apiError.retryable) return false;
  return failureCount < 2;
};

// Calculate retry delay with exponential backoff
const getRetryDelay = (attemptIndex: number): number => {
  return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
};

export function useDocuments(parentId: string | null = null): UseQueryResult<Document[], AxiosError> {
  return useQuery({
    queryKey: ["documents", parentId, getTenantId()],
    queryFn: () => documentsApi.list(parentId),
    retry: shouldRetry,
    retryDelay: getRetryDelay,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateFolder(): UseMutationResult<
  Document,
  AxiosError,
  { name: string; parentId: string | null }> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, parentId }) => documentsApi.createFolder(name, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.parentId] });
    },
  });
}

export function useUploadFile(): UseMutationResult<
  Document,
  AxiosError,
  { file: File; parentId: string | null; onProgress?: (progress: number) => void }
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, parentId, onProgress }) => 
      documentsApi.upload(file, parentId, onProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.parentId] });
    },
  });
}

export function useRenameDocument(): UseMutationResult<
  Document,
  AxiosError,
  { documentId: string; name: string }> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ documentId, name }) => documentsApi.rename(documentId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useMoveDocument(): UseMutationResult<
  Document,
  AxiosError,
  { documentId: string; parentId: string | null }> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ documentId, parentId }) => documentsApi.move(documentId, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument(): UseMutationResult<
  void,
  AxiosError,
  { documentId: string; permanent?: boolean }> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ documentId, permanent }) => documentsApi.delete(documentId, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useRestoreDocument(): UseMutationResult<
  Document,
  AxiosError,
  string
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (documentId) => documentsApi.restore(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useShareDocument(): UseMutationResult<
  { token: string; url: string },
  AxiosError,
  { documentId: string; expiresInHours?: number }> {
  return useMutation({
    mutationFn: ({ documentId, expiresInHours }) => 
      documentsApi.share(documentId, expiresInHours),
  });
}

export function useBreadcrumbs(folderId: string | null): UseQueryResult<
  Array<{ id: string | null; name: string }>,
  AxiosError
> {
  return useQuery({
    queryKey: ["breadcrumbs", folderId, getTenantId()],
    queryFn: () => documentsApi.getBreadcrumbs(folderId),
    retry: shouldRetry,
    retryDelay: getRetryDelay,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export { documentsApi };
