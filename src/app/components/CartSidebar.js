"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Menu({ items, onAddToCart }) {
  // Categorías fijas
  const categories = ["Entradas", "Fondos", "Bebidas"];
  const [activeCategory, setActiveCategory] = useState("Entradas");

  // Filtramos los platos según la categoría seleccionada
  const filteredItems = items.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-emerald-400">Nuestra Carta</h2>
        <p className="text-gray-400">Selecciona una categoría</p>
      </div>
      
      {/* --- PESTAÑAS DE CATEGORÍAS --- */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
              activeCategory === cat
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
              : "bg-zinc-900 text-gray-400 border border-zinc-800 hover:border-emerald-500/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* --- GRILLA DE PLATOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in duration-300">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group hover:shadow-2xl hover:shadow-emerald-900/10">
            {/* Imagen simulada con inicial */}
            <div className="h-48 bg-zinc-800 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"/>
               <span className="text-6xl font-black text-zinc-700 group-hover:text-zinc-600 transition-colors z-0">
                 {item.title.charAt(0)}
               </span>
               <span className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-emerald-400 font-bold border border-emerald-500/30">
                 S/ {item.price.toFixed(2)}
               </span>
            </div>
            
            <div className="p-6 relative">
              <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">Deliciosa preparación con los mejores ingredientes seleccionados.</p>
              
              <button 
                onClick={() => onAddToCart(item)}
                className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus size={18} /> Agregar al Pedido
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
