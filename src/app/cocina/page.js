"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Utensils, MapPin } from "lucide-react"; 
import { supabase } from "../../lib/supabaseClient";

export default function KitchenDisplay() {
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  
  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Para ocultar rápido
  const [hiddenIds, setHiddenIds] = useState([]); 

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) fetchOrders();
    };
    initSession();
    const interval = setInterval(() => { if (session) fetchOrders(); }, 5000);
    return () => clearInterval(interval);
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { setSession(data.session); fetchOrders(); }
  };

  const fetchOrders = async () => {
    // Solo traemos pedidos activos
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setOrders(data);
  };

  const markAsReady = async (id, e) => {
    if(e) e.stopPropagation();
    
    // 1. VISUAL: Adiós inmediato
    setHiddenIds(prev => [...prev, id]);

    // 2. BASE DE DATOS: BORRAR (DELETE)
    // Al borrar, Supabase hará la copia automática en 'sales_history' gracias al SQL del Paso 1.
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error al borrar:", error);
      alert("Error: " + error.message);
      setHiddenIds(prev => prev.filter(hid => hid !== id));
    }
  };

  const visibleOrders = orders.filter(order => !hiddenIds.includes(order.id));

  if (!session) {
     return (
       <div className="min-h-screen flex items-center justify-center p-4 bg-black">
         <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl w-full max-w-sm space-y-4 border border-zinc-800">
           <h1 className="text-2xl font-bold text-white text-center">Acceso Chef</h1>
           <input type="email" onChange={e=>setEmail(e.target.value)} className="w-full p-3 bg-black text-white rounded" placeholder="Email" />
           <input type="password" onChange={e=>setPassword(e.target.value)} className="w-full p-3 bg-black text-white rounded" placeholder="Pass" />
           <button className="w-full bg-orange-600 p-3 rounded font-bold text-white">Entrar</button>
         </form>
       </div>
     );
  }

  return (
    <div className="min-h-screen p-6 text-white relative bg-zinc-950">
      <header className="flex justify-between items-center mb-8 bg-black/40 p-4 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Utensils className="text-orange-500" /> KDS - Cocina</h1>
        <div className="bg-orange-600 px-4 py-1 rounded-full font-bold">{visibleOrders.length} Pendientes</div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleOrders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border-l-4 border-orange-500 rounded-r-xl shadow-xl overflow-hidden flex flex-col">
              <div className="bg-zinc-800 p-3 flex justify-between items-center border-b border-zinc-700">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2"><MapPin size={18} className="text-yellow-500"/> {order.table_number}</h3>
                  <span className="text-xs text-orange-400 font-mono">#{order.id}</span>
              </div>
              <div className="p-4 flex-1 bg-zinc-900/50">
                <ul className="space-y-2">{order.items && order.items.map((item, i) => (<li key={i} className="flex gap-2 border-b border-zinc-800 pb-1 text-sm"><span className="text-orange-500 font-bold">1x</span> {item.title}</li>))}</ul>
              </div>
              <button onClick={(e) => markAsReady(order.id, e)} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 flex justify-center gap-2 active:scale-95 transition-transform"><CheckCircle size={20} /> PEDIDO LISTO</button>
            </div>
        ))}
      </div>
    </div>
  );
}
