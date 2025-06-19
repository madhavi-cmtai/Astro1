import React from "react";
import Header from "@/components/(website)/Header";
import Footer from "@/components/(website)/Footer";
import FloatingButtons from "@/components/(website)/floatingButtons";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
