"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingCart, Plus, Menu as MenuIcon, X, 
  Trash2, Clock, Wifi, Award, Send, 
  MapPin, User, CreditCard 
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ==========================================
// 1. DATOS (FIXED)
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
// 2. COMPONENTES CON DISEÑO PREMIUM
// ==========================================

function InternalNavbar({ cartCount, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <div className="flex-shrink-0 font-bold text-2xl tracking-tighter text-white cursor-pointer">
            GASTRO<span className="text-emerald-500">LAB</span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#menu" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white">Menú</a>
              <a href="#reservas" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white">Reservas</a>
              <button 
                onClick={onOpenCart} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-emerald-900/20"
              >
                <ShoppingCart size={18} /> 
                <span className="bg-white text-emerald-900 px-2 py-0.5 rounded-full text-xs font-bold">{cartCount}</span>
              </button>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 px-4 pt-2 pb-4 space-y-2 border-b border-zinc-800 animate-in slide-in-from-top-5">
           <a href="#menu" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Menú</a>
           <button onClick={onOpenCart} className="w-full text-left text-emerald-400 font-bold block px-3 py-2 rounded-md text-base">
             Ver Carrito ({cartCount})
           </button>
        </div>
      )}
    </nav>
  );
}

function InternalHero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* FONDO CON GRADIENTE Y FOTO/VIDEO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-10" />
        <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop" 
            alt="Fondo Gourmet" 
            className="w-full h-full object-cover opacity-60 animate-pulse-slow scale-105"
        />
      </div>

      {/* TEXTO HERO */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 animate-in slide-in-from-bottom-10 duration-1000">
        <span className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-4 block">
            Experiencia Gastronómica
        </span>
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-white leading-tight">
          SABORES QUE <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
            TRASCIENDEN
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
          La fusión perfecta entre alta cocina y tecnología.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#menu" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-emerald-900/40 w-full md:w-auto">
                Ver la Carta
            </a>
            <button className="group bg-transparent border border-white/20 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold text-lg transition-all backdrop-blur-md w-full md:w-auto">
                Reservar Mesa
            </button>
        </div>
      </div>
    </div>
  );
}

function InternalFeatures() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { icon: Clock, title: "Velocidad", text: "Sin esperas innecesarias", color: "text-orange-500" },
            { icon: Wifi, title: "100% Digital", text: "Pide desde tu móvil", color: "text-blue-500" },
            { icon: Award, title: "Calidad Premium", text: "Ingredientes selectos", color: "text-yellow-500" }
        ].map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-8 bg-zinc-900/30 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-2">
                <div className="mb-6 p-4 bg-white/5 rounded-full ring-1 ring-white/10">
                    <feat.icon className={feat.color} size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feat.title}</h3>
                <p className="text-gray-400">{feat.text}</p>
            </div>
        ))}
      </div>
    </section>
  );
}

function InternalCartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const total = cartItems ? cartItems.reduce((sum, item) => sum + item.price, 0) : 0;
  
  // ESTADOS DEL FORMULARIO
  const [table, setTable] = useState("");
  const [name, setName] = useState("");
  const [payment, setPayment] = useState("efectivo");
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE ENVÍO CORREGIDA (Sin payment_status) ---
  const handleSend = async () => {
      if(!table || !name) { 
          alert("⚠️ Por favor ingresa tu Mesa y Nombre."); 
          return; 
      }
      
      setLoading(true);
      try {
        const { error } = await supabase.from('orders').insert([
            {
              table_number: table,
              waiter_name: name,
              items: cartItems,
              total_price: total,
              status: 'pendiente', // Esto es suficiente
              created_at: new Date(),
              payment_method: payment
              // ELIMINADO: payment_status (Esto causaba el error)
            }
        ]);

        if (error) throw error;

        alert("✅ ¡Pedido Enviado a Cocina!");
        onClearCart();
        onClose();
        setTable("");
        setName("");
      } catch (e) {
        console.error(e);
        alert("Error al enviar: " + e.message);
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-in fade-in duration-300" />}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-[70] transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Tu Pedido <span className="text-emerald-500">.</span>
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><X/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {!cartItems || cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <ShoppingCart size={48} className="mb-4"/>
                    <p>Tu carrito está vacío</p>
                </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                  <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-emerald-400 font-mono text-sm">S/ {item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => onRemoveItem(item.cartId)} className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                      <Trash2 size={18}/>
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems && cartItems.length > 0 && (
              <div className="bg-zinc-900/80 p-5 rounded-2xl mb-4 space-y-4 border border-white/10 mt-4">
                  <div className="flex gap-3">
                     <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-3 text-zinc-500" size={16}/>
                        <input 
                            placeholder="Mesa" 
                            className="w-full bg-black border border-zinc-700 p-2.5 pl-9 rounded-lg text-white focus:border-emerald-500 outline-none transition-colors" 
                            value={table} 
                            onChange={e=>setTable(e.target.value)} 
                            type="number"
                        />
                     </div>
                     <div className="relative flex-[1.5]">
                        <User className="absolute left-3 top-3 text-zinc-500" size={16}/>
                        <input 
                            placeholder="Nombre" 
                            className="w-full bg-black border border-zinc-700 p-2.5 pl-9 rounded-lg text-white focus:border-emerald-500 outline-none transition-colors" 
                            value={name} 
                            onChange={e=>setName(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="relative">
                      <CreditCard className="absolute left-3 top-3 text-zinc-500" size={16}/>
                      <select 
                        className="w-full bg-black border border-zinc-700 p-2.5 pl-9 rounded-lg text-white appearance-none cursor-pointer focus:border-emerald-500 outline-none" 
                        value={payment} 
                        onChange={e=>setPayment(e.target.value)}
                      >
                          <option value="efectivo">💵 Pago en Efectivo</option>
                          <option value="yape">📱 Yape / Plin</option>
                          <option value="tarjeta">💳 Tarjeta de Crédito</option>
                      </select>
                  </div>
              </div>
          )}

          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between text-xl font-bold mb-6 text-white">
                <span>Total a Pagar</span>
                <span className="text-emerald-400 font-mono text-2xl">S/ {total.toFixed(2)}</span>
            </div>
            <button 
                onClick={handleSend} 
                disabled={loading || cartItems.length === 0} 
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
            >
                {loading ? "Enviando Pedido..." : <>Confirmar Pedido <Send size={20}/></>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InternalFooter() {
    return (
        <footer className="py-10 text-center border-t border-white/10 bg-black">
            <p className="text-emerald-500 font-bold tracking-widest mb-2">GASTROLAB</p>
            <p className="text-gray-500 text-sm">© 2025 Restaurante Moderno. Todos los derechos reservados.</p>
        </footer>
    );
}

// ==========================================
// 3. PÁGINA PRINCIPAL (LOGICA SEGURA)
// ==========================================

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Entradas");

  // SELECCIÓN MANUAL (SIN FILTER PARA EVITAR ERRORES)
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
      // USAMOS SPLICE MANUALMENTE (SIN FILTER)
      const index = newCart.findIndex(item => item.cartId === cartId);
      if (index > -1) newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-emerald-500 selection:text-white">
      <InternalNavbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <InternalHero />
      <InternalFeatures />
      
      {/* SECCIÓN MENU INTEGRADA Y ESTILIZADA */}
      <section id="menu" className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Nuestra <span className="text-emerald-500">Carta</span></h2>
            <p className="text-gray-400 text-lg">Selecciona una categoría para comenzar</p>
        </div>
        
        {/* TABS ESTILIZADOS */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
            {["Entradas", "Fondos", "Bebidas"].map((cat) => (
            <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
                    activeCategory === cat 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 ring-2 ring-emerald-400/20" 
                    : "bg-zinc-900 text-gray-400 border border-zinc-800 hover:border-emerald-500/50 hover:text-white"
                }`}
            >
                {cat}
            </button>
            ))}
        </div>
        
        {/* GRILLA DE PLATOS ESTILIZADA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToShow.map((item) => (
            <div key={item.id} className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all group hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/10 backdrop-blur-sm">
                
                {/* IMAGEN/FONDO DEL PLATO */}
                <div className="h-56 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"/>
                    
                    {/* Placeholder visual de comida */}
                    <span className="text-8xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors duration-500 z-0 select-none transform group-hover:scale-110">
                        {item.title.charAt(0)}
                    </span>
                    
                    <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-emerald-400 font-bold z-20 border border-white/10 shadow-lg">
                        S/ {item.price.toFixed(2)}
                    </span>
                </div>

                {/* INFO DEL PLATO */}
                <div className="p-6 relative">
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">Exquisita preparación con los mejores ingredientes del día.</p>
                    
                    <button 
                        onClick={() => addToCart(item)} 
                        className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                    >
                        <Plus size={20} /> Agregar al Pedido
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