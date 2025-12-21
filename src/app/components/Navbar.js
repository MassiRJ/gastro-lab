"use client";

// Importamos con alias para evitar conflictos de nombres
import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ cartCount, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <div className="flex-shrink-0 font-bold text-2xl tracking-tighter text-white">
            GASTRO<span className="text-emerald-500">LAB</span>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#menu" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Menú</a>
              <a href="#reservas" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Reservas</a>
              <button 
                onClick={onOpenCart} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all"
              >
                <ShoppingCart size={18} /> 
                <span className="bg-white text-emerald-900 px-2 py-0.5 rounded-full text-xs">
                  {cartCount || 0}
                </span>
              </button>
            </div>
          </div>

          {/* BOTON MENU MOVIL */}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-400 hover:text-white p-2"
            >
              {/* Renderizado condicional seguro */}
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWN MOVIL */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b border-zinc-800">
          <a href="#menu" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Menú</a>
          <button 
            onClick={() => { onOpenCart(); setIsOpen(false); }}
            className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Carrito ({cartCount || 0})
          </button>
        </div>
      )}
    </nav>
  );
}
