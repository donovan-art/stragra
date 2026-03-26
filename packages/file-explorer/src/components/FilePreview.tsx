'use client';

import { useState } from "react";
import { X, Download, FileText, Image as ImageIcon, File as FileIcon } from "lucide-react";
import { Document } from "../types";

interface FilePreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreview({ document, isOpen, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen || !document) return null;

  const isImage = document.mimeType?.startsWith("image/");
  const isPDF = document.mimeType === "application/pdf";
  const isText = document.mimeType?.startsWith("text/") ||
    document.mimeType === "application/json" ||
    document.mimeType === "application/javascript";

  const previewUrl = `/api/documents/${document.id}/preview?tenantId=default-tenant`;
  const downloadUrl = `/api/documents/${document.id}/download?tenantId=default-tenant`;

  const handleDownload = () => {
    window.open(downloadUrl, "_blank");
  };

  function formatFileSize(bytes: bigint) {
    const num = Number(bytes);
    if (num === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {isImage ? (
              <ImageIcon className="w-6 h-6 text-purple-500" />
            ) : isPDF ? (
              <FileText className="w-6 h-6 text-red-500" />
            ) : (
              <FileIcon className="w-6 h-6 text-gray-500" />
            )}
            <div>
              <h3 className="text-lg font-medium truncate max-w-md" title={document.name}>
                {document.name}
              </h3>
              {document.sizeBytes !== undefined && (
                <p className="text-sm text-gray-500">
                  {formatFileSize(document.sizeBytes)} • {document.mimeType || "Unknown type"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}

          <div className={`h-full flex items-center justify-center ${isLoading ? "hidden" : ""}`}>
            {isImage ? (
              <img
                src={previewUrl}
                alt={document.name}
                className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                onLoad={() => setIsLoading(false)}
              />
            ) : isPDF || isText ? (
              <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  title={document.name}
                />
              </div>
            ) : (
              <div className="text-center">
                <FileIcon className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600 mb-4">
                  Preview not available for this file type
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Download to View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
