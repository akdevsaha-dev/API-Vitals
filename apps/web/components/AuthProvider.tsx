"use client";

import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ["/", "/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser && !isPublicRoute) {
      router.push("/signin");
    }
  }, [isCheckingAuth, authUser, isPublicRoute, router]);

  if (isCheckingAuth && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};
