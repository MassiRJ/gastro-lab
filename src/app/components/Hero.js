"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChefHat } from "lucide-react";

export default function Hero() {
  
  // --- FUNCIÓN PARA EL SCROLL SUAVE ---
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      
      {/* 1. VIDEO DE FONDO */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-60" // Ajusté la opacidad para que se lea mejor
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* 2. CONTENIDO */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-6 backdrop-blur-sm"
        >
          <ChefHat size={16} />
          <span>Experiencia Gastronómica 2025</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter"
        >
          SABOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">ABSOLUTO</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light"
        >
          Donde la tradición culinaria se encuentra con la innovación digital. 
          Reserva tu mesa en el futuro de la gastronomía.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          {/* BOTÓN 1: IR A RESERVAS */}
          <button 
            onClick={(e) => handleScroll(e, "reservas")}
            className="group relative px-8 py-4 bg-yellow-500 text-black font-bold rounded-full overflow-hidden hover:bg-yellow-400 transition-colors"
          >
            <span className="relative z-10 flex items-center gap-2">
              Reservar Mesa <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          {/* BOTÓN 2: IR AL MENÚ */}
          <button 
            onClick={(e) => handleScroll(e, "menu")}
            className="px-8 py-4 text-white border border-white/20 hover:bg-white/10 rounded-full transition-all backdrop-blur-md"
          >
            Ver Menú Digital
          </button>
        </motion.div>
      </div>
    </section>
  );
} 