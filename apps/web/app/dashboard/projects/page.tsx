"use client";

import { useState } from "react";
import { Folder, Plus, Trash2, Search } from "lucide-react";
import { CreateProjectModal } from "@/components/dashboard/CreateProjectModal";
import { useRouter } from "next/navigation";
import { useProjectStore, Project } from "@/store/projectStore";
import { ProjectSkeleton } from "@/components/dashboard/DashboardSkeleton";

import { DeleteConfirmationModal } from "@/components/dashboard/DeleteConfirmationModal";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { projects, addProject, setSelectedProject, isLoading, deleteProject } = useProjectStore();
  const router = useRouter();

  const handleCreateProject = (newProject: any) => {
    addProject({
      ...newProject,
      id: newProject.id || Math.random().toString(),
      targetCount: 0,
      createdAt: newProject.createdAt || new Date().toISOString()
    });
  };

  const openDeleteModal = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
    }
  };

  if (isLoading && projects.length === 0) {
    return <ProjectSkeleton />;
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex mt-15 flex-col gap-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Projects</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your API monitoring workspaces.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              setSelectedProject(project);
              router.push("/dashboard");
            }}
            className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-neutral-300 cursor-pointer relative"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-neutral-900">{project.name}</h3>
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">ID: {project.id.slice(0, 8)}</span>
                </div>
              </div>
              <button
                onClick={(e) => openDeleteModal(e, project)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-100 bg-neutral-50 text-neutral-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-neutral-600 mb-6 flex-1 line-clamp-2">{project.description}</p>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Targets</span>
                <span className="font-mono font-medium text-neutral-900">{project.targets?.length || 0}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Created</span>
                <span className="text-xs text-neutral-600">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateProject}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        description="This action is irreversible. All targets, audit history, and telemetry data for this project will be permanently deleted."
        confirmText={projectToDelete?.name}
        itemName={projectToDelete?.name}
        confirmPlaceholder="Enter project name..."
        isLoading={isLoading}
      />
    </div>
  );
}
