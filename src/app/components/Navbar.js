"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";

export default function Navbar({ cartCount, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // <--- NUEVO ESTADO

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para scroll suave y cerrar menú móvil
  const handleScroll = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false); // <--- Cerramos el menú móvil al hacer clic
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/10" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          
          {/* Logo */}
          <a 
            href="#inicio" 
            onClick={(e) => handleScroll(e, "inicio")}
            className="text-2xl font-bold tracking-tighter text-white cursor-pointer z-50 relative"
          >
            GASTRO <span className="text-yellow-500">•</span> LAB
          </a>

          {/* Links Desktop (Se ocultan en móvil 'hidden md:flex') */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#inicio" onClick={(e) => handleScroll(e, "inicio")} className="text-sm font-medium text-white hover:text-yellow-500 transition-colors cursor-pointer">INICIO</a>
            <a href="#nosotros" onClick={(e) => handleScroll(e, "nosotros")} className="text-sm font-medium text-gray-300 hover:text-yellow-500 transition-colors cursor-pointer">NOSOTROS</a>
            <a href="#menu" onClick={(e) => handleScroll(e, "menu")} className="text-sm font-medium text-gray-300 hover:text-yellow-500 transition-colors cursor-pointer">MENÚ</a>
            <a href="#reservas" onClick={(e) => handleScroll(e, "reservas")} className="text-sm font-medium text-gray-300 hover:text-yellow-500 transition-colors cursor-pointer">RESERVAS</a>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-4 z-50 relative">
            <button 
              onClick={onOpenCart} 
              className="relative p-2 text-white hover:text-yellow-500 transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="hidden md:block px-5 py-2 bg-yellow-500 text-black font-bold rounded-full text-sm hover:bg-yellow-400 transition-colors">
              Pedir Online
            </button>

            {/* BOTÓN HAMBURGUESA (Solo móvil) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-zinc-950 flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <a 
              href="#inicio" 
              onClick={(e) => handleScroll(e, "inicio")}
              className="text-2xl font-bold text-white hover:text-yellow-500"
            >
              INICIO
            </a>
            <a 
              href="#nosotros" 
              onClick={(e) => handleScroll(e, "nosotros")}
              className="text-2xl font-bold text-white hover:text-yellow-500"
            >
              NOSOTROS
            </a>
            <a 
              href="#menu" 
              onClick={(e) => handleScroll(e, "menu")}
              className="text-2xl font-bold text-white hover:text-yellow-500"
            >
              MENÚ
            </a>
            <a 
              href="#reservas" 
              onClick={(e) => handleScroll(e, "reservas")}
              className="text-2xl font-bold text-white hover:text-yellow-500"
            >
              RESERVAS
            </a>

            <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-full text-lg mt-8">
              Pedir Online
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}