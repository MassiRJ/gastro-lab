"use client";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[70] animate-in slide-in-from-bottom-5">
      <CheckCircle size={20} />
      <span className="font-bold">{message}</span>
    </div>
  );
}
