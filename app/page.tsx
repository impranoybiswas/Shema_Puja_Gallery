"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Image from "next/image";
import Link from "next/link";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";

type GalleryImage = {
  _id: string;
  imageUrl: string;
  userName: string;
  userEmail: string;
  createdAt: string;
};

export default function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  // ✅ Refetch function (reusable)
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/get-photos", { cache: "no-store" });
      const data = await res.json();

      if (res.ok) {
        setImages(data);
      } else {
        console.error("No images found or API error:", data);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();

    const interval = setInterval(fetchImages, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    // Step 1: Confirmation box
    const confirmed = confirm("Are you sure you want to delete this photo?");
    if (!confirmed) return;

    try {
      const res = await fetch("/api/delete-photo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Photo deleted successfully.");
        fetchImages();
      } else {
        alert(data.error || "Failed to delete photo.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh text-lg font-medium text-gray-500">
        Loading photos...
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex justify-center items-center h-dvh text-lg font-medium text-gray-500">
        No photos uploaded yet 😔
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-5">
      {images.map((img, index) => (
        <motion.div
          key={index}
          className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-104 transition-all duration-300 border-[1px] border-black/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => {
            setCurrentIndex(index);
            setOpen(true);
          }}
        >
          <Image
            src={img.imageUrl}
            width={300}
            height={200}
            alt={`Uploaded by ${img.userName}`}
            className="w-full h-40 md:h-48 object-cover "
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-xs md:text-sm p-2">
            <p className="font-semibold truncate text-sm">{img.userName}</p>
            <p className="truncate text-xs">{img.userEmail}</p>
            <p className="text-[10px] md:text-xs opacity-80">
              {new Date(img.createdAt).toLocaleDateString()}
            </p>
          </div>
          {status === "authenticated" && session?.user.role === "admin" && (
          <button
            onClick={() => handleDelete(img._id)}
            className="size-8 bg-red-400 text-white flex justify-center items-center rounded-full absolute z-20 top-2 right-2"
          >
            <FaTrash />
          </button>)}
        </motion.div>
      ))}
      {/* ✅ Lightbox */}
      <Lightbox
        open={open}
        index={currentIndex}
        close={() => setOpen(false)}
        slides={images.map((img) => ({
          src: img.imageUrl,
          description: `${img.userName} (${img.userEmail}) • ${new Date(
            img.createdAt
          ).toLocaleString()}`,
        }))}
      />
      {/* 🔗 Bottom Button */}
      <Link
        href="/upload"
        className="flex items-center justify-center gap-2 text-white text-3xl font-bold bg-[#3c40c6] size-14 rounded-full fixed bottom-10 right-8 p-4 z-60 shadow-xl text-shadow-xs"
      >
        <FaCloudUploadAlt />
      </Link>
    </div>
  );
}
