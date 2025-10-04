"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Image from "next/image";

type GalleryImage = {
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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/get-photos");
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

    fetchImages();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-500">
        Loading photos...
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-500">
        No photos uploaded yet 😔
      </div>
    );
  }

  return (
    <div className="p-6">
      <div
        className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-5 
          lg:grid-cols-8 
          gap-4
        "
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
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
              className="w-full h-40 md:h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-xs md:text-sm p-2">
              <p className="font-semibold truncate text-sm">{img.userName}</p>
              <p className="truncate text-xs">{img.userEmail}</p>
              <p className="text-[10px] md:text-xs opacity-80">
                {new Date(img.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Lightbox - clean and safe */}
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
    </div>
  );
}
