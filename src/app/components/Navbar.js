"use client";
import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ cartCount = 0, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 font-bold text-2xl tracking-tighter text-white">
            GASTRO<span className="text-emerald-500">LAB</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#menu" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium text-white transition-colors">Menú</a>
              <button 
                onClick={onOpenCart} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all"
              >
                <ShoppingCart size={18} /> 
                <span className="bg-white text-emerald-900 px-2 py-0.5 rounded-full text-xs">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-zinc-900 px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b border-zinc-800">
          <a href="#menu" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Menú</a>
        </div>
      )}
    </nav>
  );
}
