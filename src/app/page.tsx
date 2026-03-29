"use client";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HistoryGallery from "../components/HistoryGallery";
import PublicGallery from "../components/PublicGallery";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-mesh w-full">
      <Header />
      <HeroSection />
      
      <Authenticated>
        <HistoryGallery />
      </Authenticated>
      
      <Unauthenticated>
        <PublicGallery />
      </Unauthenticated>
    </main>
  );
}
