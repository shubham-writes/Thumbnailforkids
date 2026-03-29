"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2, Sparkles, Lock } from "lucide-react";
import ResultPreview from "./ResultPreview";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, useClerk } from "@clerk/nextjs";

export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const saveHistory = useMutation(api.thumbnails.saveThumbnail);
  
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const convexUser = useQuery(api.users.getUser);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    if (!user) {
      openSignIn();
      return;
    }

    if (convexUser && !convexUser.isApproved) {
      alert("Your account is pending manual approval.");
      return;
    }

    if (convexUser && convexUser.credits <= 0) {
      alert("You are out of credits! Please contact the administrator.");
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");

      setResultImage(data.imageUrl);
      
      // Save it to Convex History
      await saveHistory({
        prompt,
        imageUrl: data.imageUrl,
        userId: user.id,
      });

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Oops! Something went wrong generating your thumbnail.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-20 pb-10 px-4 flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-purple-100 mb-6 text-purple-700 font-medium">
          <Sparkles className="w-4 h-4" /> 1-Click Magic
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 pb-2">
          Thumbnail Magic
        </h1>
        <p className="text-xl text-slate-600 font-medium">
          Create eye-catching, kid-friendly thumbnails in seconds.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleGenerate}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full glass-card rounded-3xl p-3 flex flex-col md:flex-row gap-3 relative z-10"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Dinosaur driving a red firetruck 🦖🚒"
          className="flex-1 bg-white/80 outline-none text-xl md:text-2xl px-6 py-4 rounded-2xl placeholder:text-slate-400 focus:ring-4 focus:ring-purple-200 transition-all font-medium text-slate-800"
          autoFocus
          disabled={isGenerating}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              Generating... <Loader2 className="animate-spin w-6 h-6" />
            </>
          ) : (
            <>
              Generate <Wand2 className="w-6 h-6" />
            </>
          )}
        </motion.button>
      </motion.form>

      <AnimatePresence mode="wait">
        {(resultImage || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            className="w-full mt-10 origin-top"
          >
            {isGenerating ? (
              <div className="w-full aspect-video rounded-[2rem] glass-card flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] skew-x-12" />
                <div className="flex flex-col items-center gap-4 text-purple-600">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <Wand2 className="w-12 h-12 text-pink-500" />
                  </motion.div>
                  <p className="font-bold text-xl animate-pulse">Sprinkling magic dust...</p>
                </div>
              </div>
            ) : resultImage ? (
              <ResultPreview
                imageUrl={resultImage}
                onRegenerate={() => handleGenerate()}
              />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
