"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Folder,
  File,
  MoreVertical,
  Grid,
  List,
  ChevronRight,
  Home,
  Upload,
  FolderPlus,
  Trash2,
  Share2,
  Download,
  Edit2,
  AlertCircle,
  RefreshCw,
  WifiOff,
  Zap,
  Activity,
} from "lucide-react";
import {
  useDocuments,
  useCreateFolder,
  useUploadFile,
  useRenameDocument,
  useDeleteDocument,
  useBreadcrumbs,
} from "../lib/api";
import { useChaosStatus, ChaosScenarios } from "../lib/chaos";
import { parseApiError, isNetworkError, getUserFriendlyErrorMessage } from "../lib/errors";
import { Document, FileExplorerProps, BreadcrumbItem } from "../types";
import { UploadModal } from "./UploadModal";
import { FilePreview } from "./FilePreview";
import { ShareModal } from "./ShareModal";

// ============================================================================
// Error Display Components
// ============================================================================

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

function ErrorDisplay({ error, onRetry, title = "Error" }: ErrorDisplayProps): JSX.Element {
  const apiError = parseApiError(error);
  const isNetwork = isNetworkError(error);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full ${
        isNetwork ? "bg-orange-100" : "bg-red-100"
      }`}>
        {isNetwork ? (
          <WifiOff className="w-8 h-8 text-orange-600" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-600" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      <p className="text-sm text-gray-600 text-center max-w-md mb-4">
        {getUserFriendlyErrorMessage(error)}
      </p>

      {apiError.retryable && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Chaos Testing Indicator
// ============================================================================

function ChaosIndicator(): JSX.Element | null {
  const { enabled, activeScenarios } = useChaosStatus();

  if (!enabled || activeScenarios.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5" />
        <span className="font-semibold">Chaos Mode Active</span>
      </div>
      <ul className="text-sm space-y-1">
        {activeScenarios.map((scenario, index) => (
          <li key={index} className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            {scenario}
          </li>
        ))}
      </ul>
      <button
        onClick={() => ChaosScenarios.reset()}
        className="mt-3 w-full py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
      >
        Disable Chaos Mode
      </button>
    </div>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState({ onCreateFolder }: { onCreateFolder: () => void }): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Folder className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">This folder is empty</h3>
      <p className="text-sm text-gray-500 mb-4">Upload files or create a folder to get started</p>
      <button
        onClick={onCreateFolder}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <FolderPlus className="w-4 h-4" />
        Create Folder
      </button>
    </div>
  );
}

// ============================================================================
// Main FileExplorer Component
// ============================================================================

export function FileExplorer({ initialFolderId = null }: FileExplorerProps): JSX.Element {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolderId);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; document: Document | null } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [shareDocument, setShareDocument] = useState<Document | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editName, setEditName] = useState("");

  // Data fetching with error handling
  const {
    data: documents,
    isLoading,
    error: documentsError,
    refetch: refetchDocuments,
  } = useDocuments(currentFolderId);

  const {
    data: breadcrumbs,
    error: breadcrumbsError,
    refetch: refetchBreadcrumbs,
  } = useBreadcrumbs(currentFolderId);

  // Mutations with error states
  const createFolder = useCreateFolder();
  const uploadFile = useUploadFile();
  const renameDocument = useRenameDocument();
  const deleteDocument = useDeleteDocument();

  // Handle retry for all queries
  const handleRetry = useCallback(() => {
    refetchDocuments();
    refetchBreadcrumbs();
  }, [refetchDocuments, refetchBreadcrumbs]);

  const onDrop = useCallback(
    (acceptedFiles: globalThis.File[]) => {
      setIsUploadModalOpen(true);
      acceptedFiles.forEach((file) => {
        uploadFile.mutate(
          { file, parentId: currentFolderId },
          {
            onError: (error) => {
              console.error("Upload failed:", error);
              // Error is handled by the mutation, could show toast here
            },
          }
        );
      });
    },
    [currentFolderId, uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const handleFolderClick = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedItems(new Set());
  };

  const handleItemClick = (doc: Document, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(doc.id)) {
        newSelected.delete(doc.id);
      } else {
        newSelected.add(doc.id);
      }
      setSelectedItems(newSelected);
    } else if (doc.type === "folder") {
      handleFolderClick(doc.id);
    } else {
      setPreviewDocument(doc);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, doc: Document) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, document: doc });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder.mutate(
        { name: newFolderName, parentId: currentFolderId },
        {
          onError: (error) => {
            console.error("Create folder failed:", error);
          },
        }
      );
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleRename = () => {
    if (editingDocument && editName.trim()) {
      renameDocument.mutate(
        { documentId: editingDocument.id, name: editName },
        {
          onError: (error) => {
            console.error("Rename failed:", error);
          },
        }
      );
      setEditingDocument(null);
      setEditName("");
    }
  };

  const handleDelete = (doc: Document) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      deleteDocument.mutate(
        { documentId: doc.id },
        {
          onError: (error) => {
            console.error("Delete failed:", error);
          },
        }
      );
    }
    setContextMenu(null);
  };

  const formatFileSize = (bytes?: bigint): string => {
    if (!bytes) return "-";
    const num = Number(bytes);
    if (num === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Safe breadcrumbs with fallback
  const safeBreadcrumbs: BreadcrumbItem[] = breadcrumbsError || !breadcrumbs
    ? [{ id: null, name: "Home" }]
    : breadcrumbs;

  // Combine all error states
  const hasError = documentsError || breadcrumbsError;
  const mainError = documentsError || breadcrumbsError;

  return (
    <>
      <div
        className="flex flex-col h-full bg-white rounded-lg shadow-sm border"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateFolderOpen(true)}
              disabled={createFolder.isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              disabled={uploadFile.isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b bg-gray-50">
          {safeBreadcrumbs.map((crumb: BreadcrumbItem, index: number, arr: BreadcrumbItem[]) => (
            <React.Fragment key={crumb.id || "root"}>
              <button
                onClick={() => handleFolderClick(crumb.id)}
                className={`flex items-center gap-1 text-sm ${
                  index === arr.length - 1
                    ? "font-medium text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {index === 0 && <Home className="w-4 h-4" />}
                {crumb.name}
              </button>
              {index < arr.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 relative">
          {isDragActive && (
            <div className="absolute inset-0 bg-blue-50/90 flex items-center justify-center z-10">
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <p className="text-xl font-medium text-blue-900">Drop files here to upload</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : hasError ? (
            <ErrorDisplay error={mainError} onRetry={handleRetry} title="Failed to load files" />
          ) : !documents || documents.length === 0 ? (
            <EmptyState onCreateFolder={() => setIsCreateFolderOpen(true)} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={(e) => handleItemClick(doc, e)}
                  onContextMenu={(e) => handleContextMenu(e, doc)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedItems.has(doc.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    {doc.type === "folder" ? (
                      <Folder className="w-12 h-12 text-blue-500 mb-2" />
                    ) : (
                      <File className="w-12 h-12 text-gray-500 mb-2" />
                    )}
                    <p
                      className="text-sm font-medium text-gray-900 truncate w-full"
                      title={doc.name}
                    >
                      {doc.name}
                    </p>
                    {doc.type === "file" && (
                      <p className="text-xs text-gray-500 mt-1">{formatFileSize(doc.sizeBytes)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modified</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={(e) => handleItemClick(doc, e)}
                      onContextMenu={(e) => handleContextMenu(e, doc)}
                      className={`cursor-pointer ${
                        selectedItems.has(doc.id) ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {doc.type === "folder" ? (
                            <Folder className="w-5 h-5 text-blue-500" />
                          ) : (
                            <File className="w-5 h-5 text-gray-500" />
                          )}
                          <span className="text-sm text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{doc.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(doc.sizeBytes)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(doc.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContextMenu(e, doc);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
            <div
              className="fixed z-50 bg-white border rounded-lg shadow-lg py-1 min-w-[160px]"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              {contextMenu.document?.type === "file" && (
                <>
                  <button
                    onClick={() => {
                      setPreviewDocument(contextMenu.document);
                      setContextMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Preview
                  </button>
                  <button
                    onClick={() => {
                      setShareDocument(contextMenu.document);
                      setContextMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setEditingDocument(contextMenu.document);
                  setEditName(contextMenu.document?.name || "");
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Rename
              </button>
              <div className="border-t my-1" />
              <button
                onClick={() => contextMenu.document && handleDelete(contextMenu.document)}
                disabled={deleteDocument.isPending}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </>
        )}

        {/* Create Folder Modal */}
        {isCreateFolderOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-3 py-2 border rounded-lg mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") setIsCreateFolderOpen(false);
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreateFolderOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim() || createFolder.isPending}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createFolder.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {editingDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4">Rename</h3>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setEditingDocument(null);
                    setEditName("");
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingDocument(null);
                    setEditName("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRename}
                  disabled={!editName.trim() || renameDocument.isPending}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {renameDocument.isPending ? "Renaming..." : "Rename"}
                </button>
              </div>
            </div>
          </div>
        )}

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          parentId={currentFolderId}
        />

        <FilePreview
          document={previewDocument}
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
        />

        <ShareModal
          document={shareDocument}
          isOpen={!!shareDocument}
          onClose={() => setShareDocument(null)}
        />
      </div>

      <ChaosIndicator />
    </>
  );
}

export default FileExplorer;
