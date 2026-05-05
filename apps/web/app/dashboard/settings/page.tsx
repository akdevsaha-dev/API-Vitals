"use client";

import { useAuthStore } from "@/store/authStore";
import { User, Bell, Key, Shield, Webhook } from "lucide-react";

export default function SettingsPage() {
  const { authUser } = useAuthStore();

  return (
    <div className="flex mt-15 flex-col gap-8 max-w-4xl">
      <div className="flex flex-col gap-2 border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-display font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-col gap-1">
            {[
              { id: "profile", label: "Profile", icon: User, active: true },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "api-keys", label: "API Keys", icon: Key },
              { id: "webhooks", label: "Webhooks", icon: Webhook },
              { id: "security", label: "Security", icon: Shield },
            ].map((item) => (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${item.active
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
              >
                <item.icon size={16} className={item.active ? "text-neutral-900" : "text-neutral-400"} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col gap-8">
          <section className="flex flex-col gap-6 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-medium text-neutral-900">Profile Information</h2>
              <p className="text-sm text-neutral-500">Update your account's profile information and email address.</p>
            </div>

            <form className="flex flex-col gap-5 max-w-md">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={authUser?.email || "user@acme.io"}
                  disabled
                  className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-md bg-neutral-50 text-neutral-500 outline-none cursor-not-allowed"
                />
                <span className="text-xs text-neutral-400">Email cannot be changed currently.</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full h-10 px-3 text-sm border border-neutral-200 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          <section className="flex flex-col gap-6 bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
              <p className="text-sm text-neutral-500">Irreversible and destructive actions.</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-neutral-900">Delete Account</h3>
                <p className="text-sm text-neutral-500">Once you delete your account, there is no going back.</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors">
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
