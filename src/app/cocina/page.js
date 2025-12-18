"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Utensils, MapPin, Loader2 } from "lucide-react"; 
import { supabase } from "../../lib/supabaseClient";

export default function KitchenDisplay() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // DOS ESTADOS DIFERENTES:
  const [dbOrders, setDbOrders] = useState([]); // Lo que viene de internet
  const [hiddenIds, setHiddenIds] = useState([]); // Lo que tú has borrado manualmente
  
  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    // 1. Traemos TODO de la base de datos sin filtrar nada aquí
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) {
      setDbOrders(data);
    }
  };

  const markAsReady = async (id, e) => {
    if(e) e.stopPropagation();
    
    // PASO 1: VISUAL (INSTANTÁNEO)
    // Agregamos este ID a la lista de "Ocultos". 
    // Esto es sagrado: si está aquí, NO SE MUESTRA, diga lo que diga la base de datos.
    setHiddenIds(prev => [...prev, id]);

    // PASO 2: BASE DE DATOS (SEGUNDO PLANO)
    // Usamos RPC (eliminar_pedido) o delete normal. 
    // Como ya lo ocultamos visualmente, no nos importa si esto tarda 1 segundo o 10.
    const { error } = await supabase.rpc('eliminar_pedido', { pedido_id: id });
      
    if (error) {
      console.error("Error borrando en servidor:", error);
      // Opcional: Si falla real, podríamos quitarlo de hiddenIds, 
      // pero mejor dejarlo oculto para no estresar al chef.
    }
  };

  // --- FILTRO MAESTRO ---
  // Aquí ocurre la magia. Combinamos la DB con tu acción local.
  const visibleOrders = dbOrders.filter(order => {
    // Es pendiente Y NO está en la lista de ocultos
    return order.status === 'pendiente' && !hiddenIds.includes(order.id);
  });

  const Background = () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-900 via-red-900 to-rose-900 opacity-90"></div>
  );

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

  return (
    <div className="min-h-screen p-6 text-white relative">
      <Background />
      
      <header className="flex justify-between items-center mb-8 bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Utensils className="text-orange-500" /> KDS - Cocina
        </h1>
        <div className="bg-orange-600 px-4 py-1 rounded-full font-bold animate-pulse">
          {visibleOrders.length} Pendientes
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleOrders.length === 0 ? (
          <div className="col-span-full text-center py-20 text-white/50">
            <CheckCircle size={60} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl">Todo despachado</h2>
          </div>
        ) : (
          visibleOrders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border-l-4 border-orange-500 rounded-r-xl shadow-xl overflow-hidden flex flex-col h-full animate-in fade-in zoom-in duration-300">
              
              <div className="bg-zinc-800 p-3 flex justify-between items-start border-b border-zinc-700">
                <div>
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                     <MapPin size={18} className="text-yellow-500"/> {order.table_number}
                  </h3>
                  <p className="text-xs text-gray-400">ID: #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-mono font-bold text-lg">
                    {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 bg-zinc-900/50">
                <ul className="space-y-3">
                  {order.items && order.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 border-b border-zinc-800 pb-2 last:border-0">
                      <span className="text-orange-500 font-bold">1x</span>
                      <span className="text-gray-200 font-medium leading-tight">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-zinc-800 border-t border-zinc-700">
                <button 
                  onClick={(e) => markAsReady(order.id, e)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle size={20} /> PEDIDO LISTO
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}