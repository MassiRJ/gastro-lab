"use client";
import { Plus } from "lucide-react";

export default function Menu({ items, onAddToCart }) {
  // Aseguramos que items sea un array, si no, usamos vacío para evitar errores
  const menuItems = Array.isArray(items) ? items : [];

  return (
    <section id="menu" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-emerald-400">Nuestro Menú</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Selección de autor preparada con ingredientes locales.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group">
            <div className="h-48 bg-zinc-800 relative overflow-hidden">
               {/* Si tienes imágenes reales, ponlas aquí. Usamos un div gris por ahora */}
               <div className="w-full h-full bg-zinc-800 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center text-zinc-700 font-bold text-2xl">
                 {item.title[0]}
               </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <span className="text-emerald-400 font-mono font-bold">S/ {item.price}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{item.category}</p>
              <button 
                onClick={() => onAddToCart(item)}
                className="w-full bg-white/5 hover:bg-emerald-600 hover:text-white text-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={18} /> Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
