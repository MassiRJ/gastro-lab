"use client";

import { useState } from "react";
import { Plus } from "lucide-react"; // Importamos icono para el menú interno
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Testimonials from "./components/Testimonials";
import Features from "./components/Features";
import Toast from "./components/Toast";

// --- DATOS DEL MENÚ (AQUÍ MISMO, SIN IMPORTAR NADA) ---
const ENTRADAS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00 },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00 },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00 },
  { id: 4, category: "Entradas", title: "Tequeños de Queso", price: 15.00 },
];
const FONDOS = [
  { id: 5, category: "Fondos", title: "Lomo Saltado", price: 45.00 },
  { id: 6, category: "Fondos", title: "Ají de Gallina", price: 30.00 },
  { id: 7, category: "Fondos", title: "Arroz con Mariscos", price: 42.00 },
  { id: 8, category: "Fondos", title: "Seco de Cordero", price: 48.00 },
];
const BEBIDAS = [
  { id: 9, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00 },
  { id: 10, category: "Bebidas", title: "Limonada Frozen", price: 12.00 },
  { id: 11, category: "Bebidas", title: "Pisco Sour", price: 25.00 },
  { id: 12, category: "Bebidas", title: "Cerveza Cusqueña", price: 10.00 },
];

export default function Home() {
  // ESTADOS
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // ESTADO DEL MENÚ INTERNO
  const [activeCategory, setActiveCategory] = useState("Entradas");

  // LOGICA MENÚ MANUAL (SIN FILTER)
  let itemsToShow = [];
  if (activeCategory === "Entradas") itemsToShow = ENTRADAS;
  else if (activeCategory === "Fondos") itemsToShow = FONDOS;
  else itemsToShow = BEBIDAS;

  // LOGICA CARRITO
  const addToCart = (item) => {
    setCart((prev) => {
        // Aseguramos que prev siempre sea un array
        const current = prev || [];
        return [...current, { ...item, cartId: Math.random() }];
    });
    setToastMessage(`¡${item.title} agregado!`);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => {
      if (!prev) return [];
      // Usamos filter aquí porque cart SIEMPRE se inicializa como [], 
      // pero por si acaso, si falla, cámbialo a splice manual.
      // Si esto falla, es brujería.
      return prev.filter(item => item.cartId !== cartId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <Hero />
      <Features />
      
      {/* --- SECCIÓN MENÚ INTEGRADA (BUNKER) --- */}
      <section id="menu" className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">Nuestra Carta</h2>
            <p className="text-gray-400">Selecciona una categoría</p>
        </div>
        
        {/* TABS */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {["Entradas", "Fondos", "Bebidas"].map((cat) => (
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
        
        {/* ITEMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToShow.map((item) => (
            <div key={item.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group hover:shadow-2xl hover:shadow-emerald-900/10">
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
                <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Plus size={18} /> Agregar
                </button>
                </div>
            </div>
            ))}
        </div>
      </section>
      {/* --- FIN MENÚ INTEGRADO --- */}

      <Testimonials />
      <Reservation />
      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onClearCart={clearCart} 
      />
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </main>
  );
}