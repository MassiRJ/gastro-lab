"use client";

import { motion } from "framer-motion";
import { Award, Leaf, Wifi, Wine } from "lucide-react";

const features = [
  { icon: Award, title: "Premiados", desc: "Mejor Restaurante 2024" },
  { icon: Leaf, title: "100% Orgánico", desc: "Productores locales" },
  { icon: Wine, title: "Cava Exclusiva", desc: "+200 Variedades de vino" },
  { icon: Wifi, title: "High Speed", desc: "Conexión gratis para ti" },
];

export default function Features() {
  return (
    <section 
      id="nosotros" 
      // CAMBIOS CLAVE AQUÍ:
      // 1. min-h-screen: Obliga a la sección a medir AL MENOS el alto de tu pantalla.
      // 2. flex flex-col justify-center: Centra el contenido verticalmente.
      className="min-h-screen flex flex-col justify-center bg-zinc-950 border-y border-zinc-900 scroll-mt-0 relative"
    >
      <div className="container mx-auto px-4">
        
        {/* Título */}
        <div className="text-center mb-20">
          <span className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-sm">¿Por qué elegirnos?</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">Nuestra Esencia</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Grid de Íconos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Círculo del ícono con efecto hover */}
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 group-hover:bg-yellow-500 transition-all duration-500 shadow-xl group-hover:shadow-yellow-500/20 group-hover:-translate-y-2 border border-zinc-800 group-hover:border-yellow-500">
                <item.icon size={36} className="text-yellow-500 group-hover:text-black transition-colors duration-500" />
              </div>
              
              <h3 className="text-white font-bold text-xl mb-3 tracking-tight">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 