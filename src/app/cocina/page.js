// VERSION FINAL ARREGLADA - FORZANDO ACTUALIZACION DE GIT
"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Utensils, MapPin, Loader2 } from "lucide-react"; 
import { supabase } from "../../lib/supabaseClient";

export default function KitchenDisplay() {
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ESTADO LOCAL PARA OCULTAR INMEDIATAMENTE
  const [hiddenIds, setHiddenIds] = useState([]); 

  // --- ZONA DE CREDENCIALES ---
  const PROJECT_URL = "https://dpjhsqwytgdircxnspff.supabase.co"; 
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw";
  // ----------------------------

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
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
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq('status', 'pendiente') 
      .order("created_at", { ascending: true });
    
    if (data) setOrders(data);
  };

  const markAsReady = async (id, e) => {
    if(e) e.stopPropagation();

    // 1. Ocultar visualmente YA
    setHiddenIds(prev => [...prev, id]);
    console.log("🚀 Lanzando petición manual al ID:", id);

    // AQUI ESTABA EL ERROR ANTES, AHORA ESTA LA LLAVE { CORRECTA
    try {
      // USAMOS FETCH NATIVO
      const response = await fetch(`${PROJECT_URL}/rest/v1/rpc/marcar_listo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': API_KEY,
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ pedido_id: id })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error del servidor: ${text}`);
      }

      console.log("✅ IMPACTO CONFIRMADO: Pedido actualizado.");

    } catch (error) {
      console.error("❌ Fallo manual:", error);
      alert("Error de conexión: " + error.message);
      setHiddenIds(prev => prev.filter(hid => hid !== id));
    }
  };

  // Filtro Maestro
  const visibleOrders = orders.filter(order => !hiddenIds.includes(order.id));

  // --- VISTA LOGIN ---
  if (!session && !loading) {
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

  // --- VISTA COCINA ---
  return (
    <div className="min-h-screen p-6 text-white relative bg-zinc-950">
      <header className="flex justify-between items-center mb-8 bg-black/40 p-4 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Utensils className="text-orange-500" /> KDS - Cocina
        </h1>
        <div className="bg-orange-600 px-4 py-1 rounded-full font-bold">
          {visibleOrders.length} Pendientes
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleOrders.length === 0 ? (
           <div className="col-span-full text-center py-20 text-white/50">
             <CheckCircle size={60} className="mx-auto mb-4 text-green-500" />
             <h2 className="text-2xl">Todo al día, Chef.</h2>
           </div>
        ) : (
          visibleOrders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border-l-4 border-orange-500 rounded-r-xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="bg-zinc-800 p-3 flex justify-between items-center border-b border-zinc-700">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2"><MapPin size={18} className="text-yellow-500"/> {order.table_number}</h3>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">#{order.id}</span>
                    <span className="text-xs text-orange-400 font-mono">
                      {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
              </div>
              <div className="p-4 flex-1 bg-zinc-900/50">
                <ul className="space-y-2">
                  {order.items && order.items.map((item, i) => (
                    <li key={i} className="flex gap-2 border-b border-zinc-800 pb-1 text-sm md:text-base">
                      <span className="text-orange-500 font-bold">1x</span> {item.title}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={(e) => markAsReady(order.id, e)} 
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 flex justify-center gap-2 active:scale-95 transition-transform"
              >
                  <CheckCircle size={20} /> PEDIDO LISTO
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}