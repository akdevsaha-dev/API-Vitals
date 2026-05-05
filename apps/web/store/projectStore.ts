import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@repo/types";

export type AuditResult = {
  id: string;
  dnsTime: number;
  tcpTime: number;
  tlsTime: number;
  ttfb: number;
  totalTime: number;
  p50: number;
  p95: number;
  p99: number;
  stdDev: number;
  statusCode: number;
  createdAt: string;
};

export type Target = {
  id: string;
  url: string;
  label: string;
  projectId: string;
  createdAt: string;
  results?: AuditResult[];
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  targets?: Target[];
};

type ProjectStore = {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  fetchProjectDetails: (projectId: string) => Promise<void>;
  cycleProject: () => void;
  addProject: (project: Project) => void;
  setSelectedProject: (project: Project) => void;
  deleteProject: (projectId: string) => Promise<void>;
  deleteTarget: (targetId: string) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<ApiResponse<Project[]>>("/projects");
      const fetchedProjects = res.data.data || [];
      set({ projects: fetchedProjects });
      
      if (!get().selectedProject && fetchedProjects.length > 0) {
        await get().fetchProjectDetails(fetchedProjects[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
      set({ projects: [], selectedProject: null });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProjectDetails: async (projectId: string) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get<ApiResponse<Project>>(`/projects/${projectId}`);
      set({ selectedProject: res.data.data });
    } catch (error) {
      console.error("Failed to fetch project details", error);
    } finally {
      set({ isLoading: false });
    }
  },

  cycleProject: async () => {
    const { projects, selectedProject } = get();
    if (projects.length <= 1) return;

    const currentIndex = projects.findIndex(p => p.id === selectedProject?.id);
    const nextIndex = (currentIndex + 1) % projects.length;

    await get().fetchProjectDetails(projects[nextIndex].id);
  },

  addProject: (project) => {
    const { projects, selectedProject } = get();
    const newProjects = [...projects, project];
    set({
      projects: newProjects,
      selectedProject: selectedProject || project
    });
  },

  setSelectedProject: async (project) => {
    await get().fetchProjectDetails(project.id);
  },

  deleteProject: async (projectId: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      const { projects, selectedProject } = get();
      const updatedProjects = projects.filter(p => p.id !== projectId);
      
      set({ 
        projects: updatedProjects,
        selectedProject: selectedProject?.id === projectId ? (updatedProjects[0] || null) : selectedProject
      });
      
      if (selectedProject?.id === projectId && updatedProjects.length > 0) {
        await get().fetchProjectDetails(updatedProjects[0].id);
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTarget: async (targetId: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/targets/${targetId}`);
      const { selectedProject } = get();
      if (selectedProject) {
        await get().fetchProjectDetails(selectedProject.id);
      }
    } catch (error) {
      console.error("Failed to delete target", error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
