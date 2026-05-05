"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

import { useProjectStore } from "@/store/projectStore";

interface CreateTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (target: any) => void;
}

export function CreateTargetModal({ isOpen, onClose, onSuccess }: CreateTargetModalProps) {
  const { selectedProject } = useProjectStore();
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject?.id) {
      setError("No active project selected");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(`/projects/${selectedProject.id}/targets`, { url, label });
      onSuccess(res.data.data);
      setUrl("");
      setLabel("");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create target");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="font-display font-bold text-lg text-neutral-900">Add New Target</h2>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100 mb-2">
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="text-xs font-bold font-display">P</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Current Project</span>
                  <span className="text-sm font-bold text-neutral-900">{selectedProject?.name || "No project selected"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="url" className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  Target URL
                </label>
                <input
                  id="url"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/health"
                  className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-md bg-neutral-50/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="label" className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  Label
                </label>
                <input
                  id="label"
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Production API"
                  className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-md bg-neutral-50/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !url || !label || !selectedProject}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  Add Target
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
