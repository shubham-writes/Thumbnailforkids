"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const DUMMY_THUMBNAILS = [
  {
    id: 1,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/7c66e3a9-7587-40fe-bcce-0dfcc6fb5a5e",
    prompt: "Children playing hide and seek in a colorful house, one kid smiling",
  },
  {
    id: 2,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/977270a9-0378-45a6-b22c-c21da8e596ad",
    prompt: "Two kids doing a fun slime challenge with colorful slime splashing, excited faces",
  },
  {
    id: 3,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/e51c8d42-5575-4702-924b-d280217239a6",
    prompt: "A kid dressed as a superhero flying over a small city",
  },
  {
    id: 4,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/901a0cba-1ac8-4de9-9077-a9c6e0b4e099",
    prompt: "Two kids racing toy cars on a bright track, motion blur, cheerful faces",
  },
  {
    id: 5,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/d106b11d-cc2d-44cf-9fc3-a735ee22956e",
    prompt: "Kids playing with a giant balloon that is about to pop, playful mood",
  },
  {
    id: 6,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/9029a710-94a2-42f3-bde1-f54d53893c10",
    prompt: "A child finding hidden treasure, golden coins shining, surprised and happy reaction",
  },
  {
    id: 7,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/e8e07837-29f8-45ec-8b9e-4a868083fffa",
    prompt: "Kids having a picnic under a big tree with fruits and juice",
  },
  {
    id: 8,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/50457cef-3fc0-4967-b23a-563530962b02",
    prompt: "A small boy playing with a friendly puppy in a garden",
  },
  {
    id: 9,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/017e0da8-b13a-45a1-9a53-84d917520bae",
    prompt: "Three children riding bicycles on a village road with trees and blue sky",
  },
  {
    id: 10,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/01bce904-a122-4951-86b9-6eca0216571d",
    prompt: "A cute boy and girl building a sandcastle on the beach",
  },
  {
    id: 11,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/3fddc999-ca2e-41a1-a94b-938f26a54d76",
    prompt: "Two kids flying colorful kites in a sunny park",
  },
  {
    id: 12,
    url: "https://fantastic-ermine-215.convex.cloud/api/storage/bc8278cd-3751-489b-97a9-ae4dfc7d3b9e",
    prompt: "two kids making snow man with their mom",
  },
];

export default function PublicGallery() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-700 mt-10">
          See the Magic
        </h2>
        <p className="text-md text-slate-500 font-medium mt-4 max-w-2xl">
          Discover amazing 3D Pixar-style thumbnails created by creators like you.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
      >
        {DUMMY_THUMBNAILS.map((item) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative aspect-video rounded-3xl overflow-hidden glass-card shadow-lg hover:shadow-2xl transition-all"
          >
            <img
              src={item.url}
              alt={item.prompt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <p className="text-white text-base font-bold line-clamp-2 leading-tight drop-shadow-md">
                "{item.prompt}"
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
