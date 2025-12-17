"use client";

import { useState } from "react";
import { Plus, Flame, Leaf, Wine, Coffee } from "lucide-react"; // Agregué íconos decorativos

// --- BASE DE DATOS EXTENDIDA ---
const menuItems = [
  // --- ENTRADAS ---
  {
    id: 101,
    title: "Ceviche Carretillero",
    category: "Entradas",
    price: "S/ 48.00",
    description: "Pesca del día marinada en leche de tigre al ají amarillo, acompañado de chicharrón de calamar.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800",
    tag: "Popular"
  },
  {
    id: 102,
    title: "Tartar de Atún Nikkei",
    category: "Entradas",
    price: "S/ 45.00",
    description: "Atún fresco en cubos, palta, aceite de sésamo, wantán crocante y reducción de anguila.",
    image: "https://images.unsplash.com/photo-1546272989-40c92939c6c2?q=80&w=800",
  },
  {
    id: 103,
    title: "Tequeños de Lomo",
    category: "Entradas",
    price: "S/ 32.00",
    description: "Rellenos de lomo saltado jugoso, servidos con crema de rocoto ahumado y guacamole.",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800", // (Simulado)
  },

  // --- FONDOS ---
  {
    id: 201,
    title: "Bife de Chorizo Angus (400g)",
    category: "Fondos",
    price: "S/ 85.00",
    description: "Corte premium a la parrilla, término medio, acompañado de papas nativas y ensalada.",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800",
    tag: "Chef's Choice"
  },
  {
    id: 202,
    title: "Lomo Saltado al Wok",
    category: "Fondos",
    price: "S/ 65.00",
    description: "El clásico peruano. Trozos de lomo flambeados al pisco, cebolla crocante, tomate y papas amarillas.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
  },
  {
    id: 203,
    title: "Risotto de Setas Trufadas",
    category: "Fondos",
    price: "S/ 58.00",
    description: "Arroz arbóreo cremoso, mix de hongos silvestres, aceite de trufa blanca y queso parmesano.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800",
  },
  {
    id: 204,
    title: "Salmón a la Maracuyá",
    category: "Fondos",
    price: "S/ 72.00",
    description: "Filete de salmón grillado bañado en salsa agridulce de maracuyá, sobre cama de puré de camote.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800",
  },

  // --- BEBIDAS ---
  {
    id: 301,
    title: "Golden Gin Tonic",
    category: "Bebidas",
    price: "S/ 35.00",
    description: "Gin Tanqueray, tónica premium, láminas de oro de 24k, pepino y bayas de enebro.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=800",
  },
  {
    id: 302,
    title: "Pisco Sour Catedral",
    category: "Bebidas",
    price: "S/ 42.00",
    description: "Nuestra versión doble del clásico. Pisco Quebranta, limón sutil y amargo de angostura.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800",
  },
  {
    id: 303,
    title: "Limonada de Hierba Luisa",
    category: "Bebidas",
    price: "S/ 18.00",
    description: "Refrescante frozen de limón con infusión natural de hierba luisa (Sin alcohol).",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
  },

  // --- POSTRES ---
  {
    id: 401,
    title: "Volcán de Chocolate",
    category: "Postres",
    price: "S/ 30.00",
    description: "Bizcocho tibio con centro líquido de cacao al 70%, servido con helado de vainilla.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800",
  },
  {
    id: 402,
    title: "Cheesecake de Frutos Rojos",
    category: "Postres",
    price: "S/ 28.00",
    description: "Base de galleta crocante, crema de queso suave y compota artesanal de fresas y moras.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800",
  }
];

const categories = ["Todos", "Entradas", "Fondos", "Bebidas", "Postres"];

export default function Menu({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredItems = activeCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-zinc-950 px-4 relative z-30 scroll-mt-28">
      <div className="container mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestra <span className="text-yellow-500">Carta</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Una propuesta gastronómica que fusiona técnicas modernas con los sabores 
            tradicionales que tanto amas.
          </p>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium ${
                activeCategory === cat
                  ? "bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20"
                  : "bg-zinc-900 text-gray-400 border-zinc-800 hover:border-gray-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all hover:-translate-y-1 group flex flex-col"
            >
              {/* Imagen con Overlay */}
              <div className="h-52 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Etiqueta de Precio */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-yellow-500 font-bold border border-yellow-500/30 text-sm shadow-xl">
                  {item.price}
                </div>

                {/* Tag Especial (si existe) */}
                {item.tag && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Flame size={12} fill="black" /> {item.tag}
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white leading-tight group-hover:text-yellow-500 transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                  {item.description}
                </p>
                
                {/* Botón de Acción */}
                <button 
                  onClick={() => onAddToCart(item)}
                  className="w-full py-3 bg-zinc-800 hover:bg-yellow-500 hover:text-black text-white rounded-xl transition-all font-bold flex items-center justify-center gap-2 group-active:scale-95 mt-auto"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}