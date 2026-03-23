import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Document } from "../types";

const API_BASE = "/api";

// Get current tenant from auth context - placeholder for now
const getTenantId = () => "default-tenant";

// Documents API
const documentsApi = {
  list: async (parentId: string | null = null): Promise<Document[]> => {
    const params = new URLSearchParams();
    if (parentId) params.append("parentId", parentId);
    params.append("tenantId", getTenantId());
    
    const { data } = await axios.get(`${API_BASE}/documents?${params}`);
    return data;
  },

  createFolder: async (name: string, parentId: string | null = null): Promise<Document> => {
    const { data } = await axios.post(`${API_BASE}/documents/folder`, {
      name,
      parentId,
      tenantId: getTenantId(),
    });
    return data;
  },

  upload: async (file: File, parentId: string | null = null, onProgress?: (progress: number) => void): Promise<Document> => {
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
    });
    return data;
  },

  download: async (documentId: string): Promise<Blob> => {
    const { data } = await axios.get(`${API_BASE}/documents/${documentId}/download`, {
      params: { tenantId: getTenantId() },
      responseType: "blob",
    });
    return data;
  },

  preview: async (documentId: string): Promise<string> => {
    const { data } = await axios.get(`${API_BASE}/documents/${documentId}/preview`, {
      params: { tenantId: getTenantId() },
    });
    return data.url;
  },

  rename: async (documentId: string, name: string): Promise<Document> => {
    const { data } = await axios.patch(`${API_BASE}/documents/${documentId}`, {
      name,
      tenantId: getTenantId(),
    });
    return data;
  },

  move: async (documentId: string, parentId: string | null): Promise<Document> => {
    const { data } = await axios.patch(`${API_BASE}/documents/${documentId}/move`, {
      parentId,
      tenantId: getTenantId(),
    });
    return data;
  },

  delete: async (documentId: string, permanent: boolean = false): Promise<void> => {
    await axios.delete(`${API_BASE}/documents/${documentId}`, {
      params: { tenantId: getTenantId(), permanent },
    });
  },

  restore: async (documentId: string): Promise<Document> => {
    const { data } = await axios.post(`${API_BASE}/documents/${documentId}/restore`, {
      tenantId: getTenantId(),
    });
    return data;
  },

  share: async (documentId: string, expiresInHours?: number): Promise<{ token: string; url: string }> => {
    const { data } = await axios.post(`${API_BASE}/documents/${documentId}/share`, {
      tenantId: getTenantId(),
      expiresInHours,
    });
    return data;
  },

  getBreadcrumbs: async (folderId: string | null): Promise<Array<{ id: string | null; name: string }>> => {
    if (!folderId) return [{ id: null, name: "Home" }];
    
    const { data } = await axios.get(`${API_BASE}/documents/${folderId}/breadcrumbs`, {
      params: { tenantId: getTenantId() },
    });
    return data;
  },
};

// React Query Hooks
export function useDocuments(parentId: string | null = null) {
  return useQuery({
    queryKey: ["documents", parentId, getTenantId()],
    queryFn: () => documentsApi.list(parentId),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) =>
      documentsApi.createFolder(name, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.parentId] });
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      parentId,
      onProgress,
    }: {
      file: File;
      parentId: string | null;
      onProgress?: (progress: number) => void;
    }) => documentsApi.upload(file, parentId, onProgress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.parentId] });
    },
  });
}

export function useRenameDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, name }: { documentId: string; name: string }) =>
      documentsApi.rename(documentId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useMoveDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, parentId }: { documentId: string; parentId: string | null }) =>
      documentsApi.move(documentId, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, permanent }: { documentId: string; permanent?: boolean }) =>
      documentsApi.delete(documentId, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useRestoreDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.restore(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useShareDocument() {
  return useMutation({
    mutationFn: ({ documentId, expiresInHours }: { documentId: string; expiresInHours?: number }) =>
      documentsApi.share(documentId, expiresInHours),
  });
}

export function useBreadcrumbs(folderId: string | null) {
  return useQuery({
    queryKey: ["breadcrumbs", folderId, getTenantId()],
    queryFn: () => documentsApi.getBreadcrumbs(folderId),
  });
}

export { documentsApi };
