"use client";

import { useState } from "react";
import { ShoppingCart, Plus, ChefHat, Send, Utensils, User, MapPin, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

// DATOS DUROS MOZO
const ENTRADAS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00 },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00 },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00 },
];
const FONDOS = [
  { id: 4, category: "Fondos", title: "Lomo Saltado", price: 45.00 },
  { id: 5, category: "Fondos", title: "Ají de Gallina", price: 30.00 },
  { id: 6, category: "Fondos", title: "Arroz con Mariscos", price: 42.00 },
  { id: 7, category: "Fondos", title: "Seco de Cordero", price: 48.00 },
];
const BEBIDAS = [
  { id: 8, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00 },
  { id: 9, category: "Bebidas", title: "Limonada Frozen", price: 12.00 },
  { id: 10, category: "Bebidas", title: "Cerveza Cusqueña", price: 10.00 },
];

const CATEGORIES = ["Entradas", "Fondos", "Bebidas"];

export default function WaiterView() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Entradas");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");

  // SELECCION MANUAL
  let itemsToShow = [];
  if (activeCategory === "Entradas") itemsToShow = ENTRADAS;
  else if (activeCategory === "Fondos") itemsToShow = FONDOS;
  else itemsToShow = BEBIDAS;

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Math.random() }]);
  };

  // REMOVE MANUAL (SIN FILTER)
  const removeFromCart = (cartId) => {
    setCart(prev => {
        const newCart = [...prev];
        const index = newCart.findIndex(i => i.cartId === cartId);
        if (index > -1) newCart.splice(index, 1);
        return newCart;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const sendOrder = async () => {
    if (!tableNumber || !waiterName) {
      alert("⚠️ Faltan datos: Indica la Mesa y tu Nombre.");
      return;
    }
    if (cart.length === 0) {
      alert("⚠️ El carrito está vacío.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert([
        {
          table_number: tableNumber,
          waiter_name: waiterName,
          items: cart, 
          total_price: total,
          status: 'pendiente',
          created_at: new Date(),
          payment_method: 'efectivo', 
          payment_status: 'pending'
        }
      ]);
      if (error) throw error;
      alert(`✅ ¡Pedido enviado a Cocina!\nMesa: ${tableNumber}`);
      setCart([]);
      setIsCheckoutOpen(false);
      setTableNumber("");
    } catch (error) {
      console.error("Error enviando pedido:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 relative">
      <header className="bg-zinc-900 p-4 sticky top-0 z-10 border-b border-zinc-800 shadow-xl flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2"><ChefHat className="text-orange-500"/> Mozo</h1>
        <div className="text-xs text-zinc-400">Gastro Lab</div>
      </header>

      <div className="flex overflow-x-auto p-4 gap-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-bold transition-all ${
              activeCategory === cat 
              ? "bg-orange-600 text-white shadow-lg shadow-orange-900/50" 
              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {itemsToShow.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center active:scale-95 transition-transform">
            <div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-emerald-400 font-bold">S/ {item.price.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => addToCart(item)}
              className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-full border border-zinc-600 text-orange-500"
            >
              <Plus size={24}/>
            </button>
          </div>
        ))}
      </div>
      
      {/* Botón flotante y modal checkout... */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-4 pb-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
           <div className="max-w-4xl mx-auto flex justify-between items-center">
             <div onClick={() => setIsCheckoutOpen(true)} className="flex items-center gap-3">
               <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                 <ShoppingCart size={20}/>
                 <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-900">{cart.length}</span>
               </div>
               <div><p className="text-xs text-zinc-400">Total</p><p className="text-xl font-bold">S/ {total.toFixed(2)}</p></div>
             </div>
             <button onClick={() => setIsCheckoutOpen(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2">Ver & Enviar <Send size={18}/></button>
           </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4">
           {/* Modal simplificado para ahorrar espacio en la respuesta, pero funcional */}
           <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Confirmar</h2><button onClick={() => setIsCheckoutOpen(false)}><X/></button></div>
           <div className="flex-1 overflow-y-auto space-y-4">
              <input type="number" placeholder="Mesa" value={tableNumber} onChange={e=>setTableNumber(e.target.value)} className="w-full bg-zinc-800 p-3 rounded text-white"/>
              <input type="text" placeholder="Mozo" value={waiterName} onChange={e=>setWaiterName(e.target.value)} className="w-full bg-zinc-800 p-3 rounded text-white"/>
              {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between bg-zinc-900 p-3 rounded">
                      <span>{item.title}</span>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-red-500"><X size={16}/></button>
                  </div>
              ))}
           </div>
           <button onClick={sendOrder} disabled={loading} className="w-full bg-orange-600 py-4 rounded font-bold mt-4">CONFIRMAR</button>
        </div>
      )}
    </div>
  );
}