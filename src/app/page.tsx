import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HistoryGallery from "../components/HistoryGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-mesh w-full">
      <Header />
      <HeroSection />
      
      {/* Decorative Divider */}
      <div className="w-full flex justify-center py-10 opacity-30">
        <div className="w-24 h-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"></div>
      </div>
      
      <HistoryGallery />
    </main>
  );
}
