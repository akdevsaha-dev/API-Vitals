import { create } from "zustand";

type User = {
  id: string;
  email: string;
  password: string;
};

type authStore = {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  signup: (data: { email: string; password: string }) => Promise<boolean>;
};

export const useAuthStore = create<authStore>((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,

  signup: async (data: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    return true;
  },
}));
