import React from "react";
import Header from "@/components/(dashboard)/Header";
import Sidebar from "@/components/(dashboard)/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />
        <main className="flex-1 bg-[var(--background)] p-6">{children}</main>
      </div>
    </div>
  );
}

