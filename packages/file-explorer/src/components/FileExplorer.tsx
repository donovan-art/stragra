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
} from "lucide-react";
import {
  useDocuments,
  useCreateFolder,
  useUploadFile,
  useRenameDocument,
  useDeleteDocument,
  useBreadcrumbs,
} from "../lib/api";
import { Document, FileExplorerProps, BreadcrumbItem } from "../types";
import { UploadModal } from "./UploadModal";
import { FilePreview } from "./FilePreview";
import { ShareModal } from "./ShareModal";

export function FileExplorer({ initialFolderId = null }: FileExplorerProps) {
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

  const { data: documents, isLoading } = useDocuments(currentFolderId);
  const { data: breadcrumbs } = useBreadcrumbs(currentFolderId);
  const createFolder = useCreateFolder();
  const uploadFile = useUploadFile();
  const renameDocument = useRenameDocument();
  const deleteDocument = useDeleteDocument();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsUploadModalOpen(true);
      acceptedFiles.forEach((file) => {
        uploadFile.mutate({ file, parentId: currentFolderId });
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
      createFolder.mutate({ name: newFolderName, parentId: currentFolderId });
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleRename = () => {
    if (editingDocument && editName.trim()) {
      renameDocument.mutate({ documentId: editingDocument.id, name: editName });
      setEditingDocument(null);
      setEditName("");
    }
  };

  const handleDelete = (doc: Document) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      deleteDocument.mutate({ documentId: doc.id });
    }
    setContextMenu(null);
  };

  const formatFileSize = (bytes?: bigint) => {
    if (!bytes) return "-";
    const num = Number(bytes);
    if (num === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border" {...getRootProps()}>
      <input {...getInputProps()} />

      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateFolderOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
        {(breadcrumbs || [{ id: null, name: "Home" }]).map((crumb: BreadcrumbItem, index: number, arr: BreadcrumbItem[]) => (
          <React.Fragment key={crumb.id || "root"}>
            <button
              onClick={() => handleFolderClick(crumb.id)}
              className={`flex items-center gap-1 text-sm ${
                index === arr.length - 1 ? "font-medium text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {index === 0 && <Home className="w-4 h-4" />}
              {crumb.name}
            </button>
            {index < arr.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
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
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {documents?.map((doc) => (
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
                  <p className="text-sm font-medium text-gray-900 truncate w-full" title={doc.name}>
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
                {documents?.map((doc) => (
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
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.updatedAt)}</td>
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
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                disabled={!newFolderName.trim()}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Create
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
                disabled={!editName.trim()}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Rename
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
  );
}
