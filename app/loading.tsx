import React from "react";

export default function Loading() {
  return (
    <main className="w-full h-100 flex items-center justify-center z-10">
      <div className="w-14 h-14 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin" />
    </main>
  );
}
