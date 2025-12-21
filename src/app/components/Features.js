"use client";
import { Clock, Wifi, Award } from "lucide-react";

export default function Features() {
  // SOLUCIÓN NUCLEAR: Creamos los iconos AQUÍ MISMO con sus etiquetas < />
  // Así React no se confunde intentando renderizar un objeto.
  const features = [
    { 
      element: <Clock className="text-orange-500" size={32} />, 
      title: "Rápido", 
      desc: "De la cocina a tu mesa en tiempo récord." 
    },
    { 
      element: <Wifi className="text-blue-500" size={32} />, 
      title: "Digital", 
      desc: "Pide desde tu móvil sin esperar al mozo." 
    },
    { 
      element: <Award className="text-yellow-500" size={32} />, 
      title: "Calidad", 
      desc: "Ingredientes premium seleccionados a diario." 
    },
  ];

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors">
            <div className="mb-4 p-3 bg-white/5 rounded-full">
              {/* Ahora solo pintamos el elemento ya creado. Cero riesgo de error. */}
              {feature.element}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
