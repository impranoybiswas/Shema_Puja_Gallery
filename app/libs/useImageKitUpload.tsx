"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

type UseImageKitUploadReturn = {
  uploadImage: (file: File) => Promise<string | null>;
  loading: boolean;
};

export const useImageKitUpload = (
  folder: string = "default"
): UseImageKitUploadReturn => {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image size should be under 3MB");
      return null;
    }

    setLoading(true);

    try {
      // 1️⃣ Get signature from your server
      const sigRes = await fetch("/api/imagekit-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });

      if (!sigRes.ok) throw new Error("Failed to get signature");
      const {
        signature,
        token,
        expire,
        folder: serverFolder,
      } = await sigRes.json();

      // 2️⃣ Upload to ImageKit
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", `/${serverFolder}`);
      formData.append("signature", signature);
      formData.append("token", token);
      formData.append("expire", expire);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
      );

      const res = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      const data = await res.json();
      toast.success("Image uploaded successfully!");
      return data.url; // secure URL
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading };
};
