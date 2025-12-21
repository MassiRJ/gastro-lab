"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function Toast({ message, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-0 right-0 z-[60] flex justify-center pointer-events-none"
        >
          <div className="bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl border border-zinc-800 flex items-center gap-3 backdrop-blur-md">
            <div className="bg-green-500/20 text-green-500 p-1 rounded-full">
              <CheckCircle size={16} />
            </div>
            <span className="font-medium text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}