"use client";
import { Clock, Wifi, Award } from "lucide-react";

export default function Features() {
  const features = [
    { icon: <Clock className="text-orange-500" />, title: "Rápido", desc: "De la cocina a tu mesa en tiempo récord." },
    { icon: <Wifi className="text-blue-500" />, title: "Digital", desc: "Pide desde tu móvil sin esperar al mozo." },
    { icon: <Award className="text-yellow-500" />, title: "Calidad", desc: "Ingredientes premium seleccionados a diario." },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
            <div className="mb-4 p-3 bg-white/5 rounded-full">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
