"use client";

import { useState } from "react";
import { X, Copy, Check, Clock } from "lucide-react";
import { Document } from "../types";
import { useShareDocument } from "../lib/api";

interface ShareModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ document, isOpen, onClose }: ShareModalProps) {
  const [expiresIn, setExpiresIn] = useState<number | undefined>(24);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const shareDocument = useShareDocument();

  if (!isOpen || !document) return null;

  const handleShare = () => {
    shareDocument.mutate(
      {
        documentId: document.id,
        expiresInHours: expiresIn,
      },
      {
        onSuccess: (data) => {
          setShareUrl(data.url);
        },
      }
    );
  };

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Share "{document.name}"</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!shareUrl ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Link expires after
                  </div>
                </label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(Number(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={1}>1 hour</option>
                  <option value={24}>24 hours</option>
                  <option value={168}>7 days</option>
                  <option value={720}>30 days</option>
                  <option value={undefined}>Never</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  Anyone with this link will be able to view and download this file.
                </p>
              </div>

              <button
                onClick={handleShare}
                disabled={shareDocument.isPending}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {shareDocument.isPending ? "Creating link..." : "Create share link"}
              </button>
            </>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {expiresIn && (
                <p className="text-sm text-gray-500">
                  This link will expire in{" "}
                  {expiresIn === 1
                    ? "1 hour"
                    : expiresIn === 24
                    ? "24 hours"
                    : expiresIn === 168
                    ? "7 days"
                    : expiresIn === 720
                    ? "30 days"
                    : `${expiresIn} hours`}
                  .
                </p>
              )}

              <button
                onClick={() => setShareUrl(null)}
                className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Create new link
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
