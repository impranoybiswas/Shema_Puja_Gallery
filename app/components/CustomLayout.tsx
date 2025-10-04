"use client";
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast';

export default function CustomLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster/>
      {children}
    </SessionProvider>
  )
}
