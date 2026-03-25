export interface Document {
  id: string;
  tenantId: string;
  parentId: string | null;
  name: string;
  type: "folder" | "file";
  mimeType?: string;
  sizeBytes?: bigint;
  storagePath?: string;
  isShared: boolean;
  sharedLinkToken?: string;
  sharedLinkExpiresAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export interface FileExplorerProps {
  tenantId?: string;
  initialFolderId?: string | null;
}

export interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}
