"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  confirmPlaceholder?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmPlaceholder = "Type here...",
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");
  const isMatch = confirmText ? inputValue === confirmText : true;

  useEffect(() => {
    if (!isOpen) setInputValue("");
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isMatch && !isLoading) {
      await onConfirm();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} />
                <h2 className="font-display font-bold text-lg">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {description} {itemName && <span className="font-bold text-neutral-900">"{itemName}"</span>}
              </p>

              {confirmText && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                    To confirm, type <span className="text-red-600 font-bold lowercase">"{confirmText}"</span> below:
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={confirmPlaceholder}
                    className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-md bg-neutral-50 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!isMatch || isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-600/20"
                >
                  {isLoading ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
