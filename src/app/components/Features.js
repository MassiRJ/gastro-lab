"use client";
import { Clock, Wifi, Award } from "lucide-react";

export default function Features() {
  const features = [
    // ⚠️ CAMBIO CLAVE: No usamos <Clock />, usamos Clock (sin los picos)
    // Guardamos el componente en una variable llamada 'Icon'
    { Icon: Clock, color: "text-orange-500", title: "Rápido", desc: "De la cocina a tu mesa en tiempo récord." },
    { Icon: Wifi, color: "text-blue-500", title: "Digital", desc: "Pide desde tu móvil sin esperar al mozo." },
    { Icon: Award, color: "text-yellow-500", title: "Calidad", desc: "Ingredientes premium seleccionados a diario." },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
            <div className="mb-4 p-3 bg-white/5 rounded-full">
              {/* AQUI RENDERIZAMOS EL ICONO COMO COMPONENTE */}
              <feature.Icon className={feature.color} size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
