"use client";
import { useState } from "react";
import { ShoppingCart, Plus, ChefHat, Send, Utensils, User, MapPin, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

// DATOS DUROS
const ENTRADAS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00 },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00 },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00 },
];
const FONDOS = [
  { id: 4, category: "Fondos", title: "Lomo Saltado", price: 45.00 },
  { id: 5, category: "Fondos", title: "Ají de Gallina", price: 30.00 },
  { id: 6, category: "Fondos", title: "Arroz con Mariscos", price: 42.00 },
];
const BEBIDAS = [
  { id: 8, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00 },
  { id: 9, category: "Bebidas", title: "Limonada Frozen", price: 12.00 },
];

export default function WaiterView() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Entradas");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [waiterName, setWaiterName] = useState("");

  // SELECCION MANUAL (SIN FILTER)
  let itemsToShow = [];
  if (activeCategory === "Entradas") itemsToShow = ENTRADAS;
  else if (activeCategory === "Fondos") itemsToShow = FONDOS;
  else itemsToShow = BEBIDAS;

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Math.random() }]);
  };

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
    if (!tableNumber || !waiterName) { alert("Faltan datos"); return; }
    if (cart.length === 0) { alert("Carrito vacío"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert([{
          table_number: tableNumber,
          waiter_name: waiterName,
          items: cart, 
          total_price: total,
          status: 'pendiente',
          created_at: new Date(),
          payment_method: 'efectivo', 
          payment_status: 'pending'
      }]);
      if (error) throw error;
      alert("✅ Pedido enviado");
      setCart([]); setIsCheckoutOpen(false); setTableNumber("");
    } catch (error) { alert("Error: " + error.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24 relative">
       {/* (UI Simplificada para asegurar compilación) */}
      <header className="bg-zinc-900 p-4"><h1 className="text-xl font-bold text-orange-500">Mozo</h1></header>
      <div className="flex gap-2 p-4">
        {["Entradas", "Fondos", "Bebidas"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded ${activeCategory === cat ? 'bg-orange-600' : 'bg-zinc-800'}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 p-4">
        {itemsToShow.map(item => (
          <div key={item.id} className="bg-zinc-900 p-4 rounded flex justify-between">
            <span>{item.title}</span>
            <button onClick={() => addToCart(item)} className="bg-orange-600 p-2 rounded"><Plus/></button>
          </div>
        ))}
      </div>
      {cart.length > 0 && <button onClick={() => setIsCheckoutOpen(true)} className="fixed bottom-4 right-4 bg-emerald-600 p-4 rounded-full shadow-lg"><ShoppingCart/></button>}
      
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/90 p-8 z-50">
            <h2 className="text-xl mb-4">Confirmar</h2>
            <input placeholder="Mesa" value={tableNumber} onChange={e=>setTableNumber(e.target.value)} className="w-full bg-zinc-800 p-2 mb-2"/>
            <input placeholder="Mozo" value={waiterName} onChange={e=>setWaiterName(e.target.value)} className="w-full bg-zinc-800 p-2 mb-4"/>
            <button onClick={sendOrder} disabled={loading} className="w-full bg-orange-600 p-4 rounded font-bold">ENVIAR</button>
            <button onClick={() => setIsCheckoutOpen(false)} className="w-full mt-4 text-gray-400">Cancelar</button>
        </div>
      )}
    </div>
  );
}