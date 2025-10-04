import Image from "next/image";
import React from "react";

export default function Navbar() {
  return (
    <nav className="h-32 w-full text-white flex flex-col items-center gap-1 fixed top-0 left-0 z-50 justify-center bg-gray-700 border-b border-slate-900 px-5 rounded-b-xl shadow-lg">
      <Image
        className="border-2 border-white size-12 object-cover rounded-full"
        src="/kali.jpg"
        alt="Logo"
        width={100}
        height={100}
      />
      <h1 className="font-semibold">শ্রী শ্রী শ্যামা পূজা ছবিঘর</h1>
      <p className="text-xs">মুজাফরাবাদ পল্লী উন্নয়ন সংস্থা</p>
    </nav>
  );
}
