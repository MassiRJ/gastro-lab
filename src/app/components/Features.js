"use client";
import { Clock, Wifi, Award } from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CARACTERÍSTICA 1: RÁPIDO */}
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="mb-4 p-3 bg-white/5 rounded-full">
            <Clock className="text-orange-500" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Rápido</h3>
          <p className="text-gray-400 text-sm">De la cocina a tu mesa en tiempo récord.</p>
        </div>

        {/* CARACTERÍSTICA 2: DIGITAL */}
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="mb-4 p-3 bg-white/5 rounded-full">
            <Wifi className="text-blue-500" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Digital</h3>
          <p className="text-gray-400 text-sm">Pide desde tu móvil sin esperar al mozo.</p>
        </div>

        {/* CARACTERÍSTICA 3: CALIDAD */}
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="mb-4 p-3 bg-white/5 rounded-full">
            <Award className="text-yellow-500" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Calidad</h3>
          <p className="text-gray-400 text-sm">Ingredientes premium seleccionados a diario.</p>
        </div>

      </div>
    </section>
  );
}
