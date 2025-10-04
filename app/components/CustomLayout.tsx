"use client";
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';

export default function CustomLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Toaster/>
      <Navbar/>

      {children}
      <Footer/>
    </SessionProvider>
  )
}
