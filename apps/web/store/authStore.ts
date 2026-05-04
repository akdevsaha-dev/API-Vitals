import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@repo/types";
import { create } from "zustand";

type User = {
  id: string;
  email: string;
};

type authStore = {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  signup: (data: { email: string; password: string }) => Promise<boolean>;
  signin: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<authStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<ApiResponse<User>>(
        "/auth/signup",
        data,
      );
      set({ authUser: res.data.data });
      return res.data.success;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<ApiResponse<User>>(
        "/auth/signin",
        data,
      );
      set({ authUser: res.data.data });
      return res.data.success;
    } catch (error) {
      console.error("Signin error:", error);
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post<ApiResponse<null>>("/auth/signout");
      set({ authUser: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.post<ApiResponse<User>>("/auth/check-auth");
      set({ authUser: res.data.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
