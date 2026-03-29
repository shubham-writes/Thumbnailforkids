"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Zap, Wand } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 overflow-hidden"
          >
            {/* Decorative background gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 opacity-10" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-6 z-10 relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
                <Wand className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                You're out of magic! 🪄
              </h3>

              <p className="text-slate-600 mb-8 font-medium">
                Upgrade for $15/month to unlock <strong className="text-purple-600">200 more thumbnails</strong> and keep creating amazing content.
              </p>

              <a
                href="https://shubhamverma51.gumroad.com/l/uqlgbx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                Upgrade to Pro
              </a>

              <button
                onClick={onClose}
                className="mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
