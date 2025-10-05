"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CustomLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster />
      <Navbar />

      <main className="min-h-dvh w-full px-6 pb-15 pt-38 bg-[#d2dae2] overflow-hidden">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  );
}
