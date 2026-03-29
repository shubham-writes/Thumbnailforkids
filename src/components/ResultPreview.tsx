import { Download, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ResultPreviewProps {
  imageUrl: string;
  onRegenerate: () => void;
}

export default function ResultPreview({ imageUrl, onRegenerate }: ResultPreviewProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KidsThumb-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden glass-card relative group shadow-2xl">
      <motion.img
        src={imageUrl}
        alt="Generated Thumbnail"
        className="w-full h-full object-cover rounded-3xl border-4 border-white shadow-inner"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5, type: "spring" }}
      />
      
      {/* Overlay Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-6 opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <button
          onClick={handleDownload}
          className="bg-white text-purple-600 hover:bg-purple-50 p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 font-bold"
        >
          <Download className="w-6 h-6" /> Download
        </button>
        <button
          onClick={onRegenerate}
          className="bg-purple-600 text-white hover:bg-purple-500 p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 font-bold"
        >
          <RefreshCcw className="w-6 h-6" /> Regenerate
        </button>
      </motion.div>
    </div>
  );
}
