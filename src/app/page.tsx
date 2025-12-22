"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingCart, Plus, Menu as MenuIcon, X, 
  Trash2, Clock, Wifi, Award, Send, 
  MapPin, User, CreditCard 
} from "lucide-react";

// ==========================================
// 1. DATOS (HARDCODED)
// ==========================================
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

// ==========================================
// 2. COMPONENTES INTERNOS (Para evitar imports)
// ==========================================

function InternalNavbar({ cartCount, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 font-bold text-2xl tracking-tighter text-white">
            GASTRO<span className="text-emerald-500">LAB</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#menu" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Menú</a>
              <button onClick={onOpenCart} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all">
                <ShoppingCart size={18} /> <span className="bg-white text-emerald-900 px-2 py-0.5 rounded-full text-xs">{cartCount}</span>
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-zinc-900 px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b border-zinc-800">
           <button onClick={onOpenCart} className="w-full text-left text-white block px-3 py-2 rounded-md text-base font-medium">Ver Carrito ({cartCount})</button>
        </div>
      )}
    </nav>
  );
}

function InternalHero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
        <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop" alt="Fondo" className="w-full h-full object-cover opacity-60 animate-pulse-slow scale-105"/>
      </div>
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-white leading-tight">SABORES QUE <br/><span className="text-emerald-500">TRASCIENDEN</span></h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">Alta cocina y tecnología fusionadas.</p>
        <div className="flex justify-center gap-4"><a href="#menu" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-full font-bold text-lg">Ver Carta</a></div>
      </div>
    </div>
  );
}

function InternalFeatures() {
  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
          <div className="mb-4 p-3 bg-white/5 rounded-full"><Clock className="text-orange-500" size={32} /></div>
          <h3 className="text-xl font-bold mb-2">Rápido</h3>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
          <div className="mb-4 p-3 bg-white/5 rounded-full"><Wifi className="text-blue-500" size={32} /></div>
          <h3 className="text-xl font-bold mb-2">Digital</h3>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
          <div className="mb-4 p-3 bg-white/5 rounded-full"><Award className="text-yellow-500" size={32} /></div>
          <h3 className="text-xl font-bold mb-2">Calidad</h3>
        </div>
      </div>
    </section>
  );
}

function InternalCartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const total = cartItems ? cartItems.reduce((sum, item) => sum + item.price, 0) : 0;
  
  // FORMULARIO LOCAL
  const [table, setTable] = useState("");
  const [name, setName] = useState("");

  const handleSend = () => {
      alert("✅ Pedido enviado (Simulación)");
      onClearCart();
      onClose();
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-[70] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold">Tu Pedido</h2><button onClick={onClose}><X/></button></div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {!cartItems || cartItems.length === 0 ? <p className="text-center text-gray-500">Vacío</p> : 
              cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                  <div><h4 className="font-bold">{item.title}</h4><p className="text-emerald-400">S/ {item.price}</p></div>
                  <button onClick={() => onRemoveItem(item.cartId)} className="text-red-500"><Trash2 size={18}/></button>
                </div>
              ))
            }
          </div>
          {cartItems && cartItems.length > 0 && (
              <div className="bg-black/50 p-4 rounded mb-4 space-y-2">
                  <input placeholder="Mesa" className="w-full bg-zinc-800 p-2 rounded" value={table} onChange={e=>setTable(e.target.value)}/>
                  <input placeholder="Nombre" className="w-full bg-zinc-800 p-2 rounded" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
          )}
          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between text-xl font-bold mb-6"><span>Total</span><span className="text-emerald-400">S/ {total.toFixed(2)}</span></div>
            <button onClick={handleSend} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">Confirmar</button>
          </div>
        </div>
      </div>
    </>
  );
}

function InternalFooter() {
    return <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/10">© 2025 GastroLab</footer>;
}

// ==========================================
// 3. PÁGINA PRINCIPAL (MONOLITO)
// ==========================================

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Entradas");

  // SELECCIÓN MANUAL (SIN FILTER)
  let itemsToShow = [];
  if (activeCategory === "Entradas") itemsToShow = ENTRADAS;
  else if (activeCategory === "Fondos") itemsToShow = FONDOS;
  else itemsToShow = BEBIDAS;

  const addToCart = (item) => {
    setCart((prev) => {
        const current = prev || [];
        return [...current, { ...item, cartId: Math.random() }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => {
      if (!prev) return [];
      const newCart = [...prev];
      // USAMOS SPLICE, NO FILTER
      const index = newCart.findIndex(item => item.cartId === cartId);
      if (index > -1) newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  return (
    <main className="bg-black min-h-screen text-white">
      <InternalNavbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <InternalHero />
      <InternalFeatures />
      
      {/* SECCIÓN MENU INTEGRADA */}
      <section id="menu" className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-emerald-400">Nuestra Carta</h2>
        </div>
        
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {["Entradas", "Fondos", "Bebidas"].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full font-bold ${activeCategory === cat ? "bg-emerald-600" : "bg-zinc-900 border border-zinc-800"}`}>
                {cat}
            </button>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToShow.map((item) => (
            <div key={item.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
                <div className="h-48 bg-zinc-800 flex items-center justify-center relative">
                    <span className="text-6xl font-black text-zinc-700">{item.title.charAt(0)}</span>
                    <span className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded text-emerald-400 font-bold">S/ {item.price.toFixed(2)}</span>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <button onClick={() => addToCart(item)} className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Plus size={18} /> Agregar
                    </button>
                </div>
            </div>
            ))}
        </div>
      </section>

      <InternalFooter />
      
      <InternalCartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onClearCart={clearCart} 
      />
    </main>
  );
}