"use client";

import { useAuthStore } from "@/store/authStore";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isSigningUp } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async () => {
    const success = await signup({ email, password });
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center font-sans">
      <div className="dots absolute inset-0 z-0 opacity-50"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white border border-neutral-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Lumen · Auth
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-neutral-900">
            Create an account
          </h1>
          <p className="text-sm text-neutral-500">
            Start probing your endpoints with Lumen today.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
              Email Address
            </label>
            <div className="flex h-12 items-center gap-3 px-4 border border-neutral-200 bg-neutral-50/50 focus-within:border-black focus-within:bg-white transition-colors">
              <Mail size={16} className="text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-full text-sm outline-none bg-transparent text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
              Password
            </label>
            <div className="flex h-12 items-center gap-3 px-4 border border-neutral-200 bg-neutral-50/50 focus-within:border-black focus-within:bg-white transition-colors">
              <Lock size={16} className="text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-full text-sm outline-none bg-transparent text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSignUp}
          disabled={isSigningUp || !email || !password}
          className="bg-black hover:bg-neutral-800 text-white h-12 flex items-center justify-center gap-2 w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="font-light text-sm">Create Account</span>
          {isSigningUp ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <ArrowRight
              size={16}
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
            />
          )}
        </button>

        <div className="text-center text-sm text-neutral-500 font-light">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-black font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};
