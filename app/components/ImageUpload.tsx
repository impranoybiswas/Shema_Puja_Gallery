"use client";

import Image from "next/image";
import { useImageKitUpload } from "../libs/useImageKitUpload";
import React from "react";

type ImageUploadProps = {
  folder?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
  className?: string;
  imageUrl?: string | null;
};

export function ImageUpload({
  folder = "default",
  onUploadSuccess,
  label = "Upload Image",
  className = "",
  imageUrl = null,
}: ImageUploadProps) {
  const { uploadImage, loading } = useImageKitUpload(folder);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) onUploadSuccess(uploadedUrl);
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 shadow-sm bg-white ${className}`}
    >
      {/* Upload Input */}
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <label className="text-gray-700 font-medium">{label}</label>
        <input
          type="file"
          onChange={handleChange}
          disabled={loading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
            transition-colors duration-200"
        />
      </div>

      {/* Preview Image */}
      <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="w-10 h-10 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={imageUrl || "/placeholder-image.svg"}
          alt="Uploaded preview"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}
