"use client";

import React, { useState } from "react";
import { ImageUpload } from "../components/ImageUpload";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleUploadSuccess = async (url: string) => {
    setImageUrl(url);
    setSaving(true);

    try {
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Uploaded and saved successfully!");
        console.log("Saved to MongoDB, ID:", result.id);
        router.push("/");
      } else {
        toast.error(result.error || "Failed to save image.");
        console.error("MongoDB save error:", result.error);
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
      console.error("Network error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      {/* Left side: Login / Info */}
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white shadow-lg rounded-2xl p-6 space-y-6 mx-auto max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Upload Your Puja Photo
        </h2>

        {status === "loading" && (
          <p className="text-center text-gray-500">Checking session...</p>
        )}

        {status === "unauthenticated" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600 font-medium">
              Please login to upload your photo
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => signIn("google")}
              className="flex items-center gap-3 bg-white border border-gray-300 py-3 px-5 rounded-lg shadow hover:bg-gray-100 transition font-medium cursor-pointer"
            >
              <FcGoogle className="w-6 h-6" />
              Continue with Google
            </motion.button>
          </div>
        )}

        {status === "authenticated" && session?.user && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
            <div>
              <p className="text-gray-700 font-semibold">{session.user.name}</p>
              <p className="text-gray-500 text-sm">{session.user.email}</p>
              <p className="text-gray-500 text-sm">{session.user.role}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => signOut()}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Log out
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Right side: Upload Section */}
      {status === "authenticated" && session?.user && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 bg-white rounded-2xl shadow-lg w-full mx-auto max-w-lg"
        >
          <p className="text-gray-700 text-center mb-4">
            Select a photo to upload
          </p>

          <ImageUpload
            folder="shemapuja"
            label="Puja Photo"
            imageUrl={imageUrl}
            onUploadSuccess={handleUploadSuccess}
            className="mb-4"
          />

          {saving && (
            <p className="text-center text-blue-600 font-medium">
              Saving to database...
            </p>
          )}

          {imageUrl && !saving && (
            <p className="text-center text-green-600 font-medium">
              Uploaded and saved successfully!
            </p>
          )}
        </motion.div>
      )}

      {/* 🔗 Bottom Button */}
      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-white text-3xl font-bold bg-[#3c40c6] size-14 rounded-full fixed bottom-10 right-8 p-4 z-60 shadow-xl text-shadow-xs"
      >
        <FaHome />
      </Link>
    </section>
  );
}
