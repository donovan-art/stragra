'use client';

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, File, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useUploadFile } from "../lib/api";
import { UploadFile as UploadFileType } from "../types";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
}

export function UploadModal({ isOpen, onClose, parentId }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFileType[]>([]);
  const uploadFile = useUploadFile();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadFileType[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));
      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((uploadFileItem) => {
        uploadFile.mutate(
          {
            file: uploadFileItem.file,
            parentId,
            onProgress: (progress) => {
              setFiles((prev) =
                prev.map((f) =
                  f.file === uploadFileItem.file
                    ? { ...f, progress, status: progress === 100 ? "completed" : "uploading" }
                    : f
                )
              );
            },
          },
          {
            onError: () => {
              setFiles((prev) =
                prev.map((f) =
                  f.file === uploadFileItem.file
                    ? { ...f, status: "error", error: "Upload failed" }
                    : f
                )
              );
            },
          }
        );
      });
    },
    [parentId, uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: files.length > 0,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== fileToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Upload Files</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`p-6 transition-colors ${
            isDragActive ? "bg-blue-50" : ""
          } ${files.length === 0 ? "border-2 border-dashed border-gray-300 rounded-lg m-4" : ""}`}
        >
          <input {...getInputProps()} />

          {files.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {files.map((uploadFile, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <File className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.status === "uploading" && (
                      <div className="mt-2">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {uploadFile.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : uploadFile.status === "error" ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <button
                        onClick={() => removeFile(uploadFile.file)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isDragActive && (
                <div className="text-center py-4 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg">
                  <p className="text-blue-600">Drop files to add more</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            {files.some((f) => f.status === "uploading") ? "Uploading..." : "Done"}
          </button>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  onDrop(Array.from(files));
                }
              };
              input.click();
            }}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Files
          </button>
        </div>
      </div>
    </div>
  );
}
