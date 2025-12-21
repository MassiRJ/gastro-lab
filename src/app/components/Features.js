"use client";
import { Clock, Wifi, Award } from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
          <div className="mb-4 p-3 bg-white/5 rounded-full">
            <Clock className="text-orange-500" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Velocidad Flash</h3>
          <p className="text-gray-400 text-sm">De la cocina a tu mesa sin esperas.</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
          <div className="mb-4 p-3 bg-white/5 rounded-full">
            <Wifi className="text-blue-500" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">100% Digital</h3>
          <p className="text-gray-400 text-sm">Tu móvil es tu mozo.</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
          <div className="mb-4 p-3 bg-white/5 rounded-full">
            <Award className="text-yellow-500" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Alta Calidad</h3>
          <p className="text-gray-400 text-sm">Ingredientes frescos cada día.</p>
        </div>

      </div>
    </section>
  );
}
