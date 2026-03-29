"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";

export default function HistoryGallery() {
  const thumbnails = useQuery(api.thumbnails.getRecentThumbnails);

  if (thumbnails === undefined) {
    return (
      <div className="w-full flex justify-center py-10 opacity-50">
        <Sparkles className="animate-pulse w-8 h-8 text-purple-400" />
      </div>
    );
  }

  if (thumbnails.length === 0) {
    return null; // Empty state
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800">Recent Magicas</h2>

      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
      >
        {thumbnails.map((item) => (
          <motion.div
            key={item._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative aspect-video rounded-2xl overflow-hidden glass-card shadow-lg hover:shadow-2xl transition-all"
          >
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-sm font-medium line-clamp-2 leading-tight mb-2 drop-shadow-md">
                "{item.prompt}"
              </p>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await fetch(item.imageUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `KidsThumb-${item._id}.png`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Gallery download failed", error);
                    window.open(item.imageUrl, "_blank");
                  }
                }}
                className="self-end bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
