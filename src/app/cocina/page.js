"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Utensils, MapPin, Loader2 } from "lucide-react"; // Importamos Loader2
import { supabase } from "../../lib/supabaseClient";

export default function KitchenDisplay() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [processingId, setProcessingId] = useState(null); // Para saber qué botón está cargando
  
  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🛡️ LISTA NEGRA: Guardamos los IDs como TEXTO (Strings)
  const deletedIdsRef = useRef(new Set()); 

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (session) fetchOrders();
    };
    initSession();

    // Auto-refresco cada 5 segundos
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
      .order("created_at", { ascending: true });
    
    if (data) {
      // FILTRO ANTI-ZOMBIE (A PRUEBA DE FALLOS):
      // Convertimos todo a String() para asegurar que la comparación funcione siempre
      const cleanOrders = data.filter(o => 
        o.status === 'pendiente' && !deletedIdsRef.current.has(String(o.id))
      );
      setOrders(cleanOrders);
    }
  };

  const markAsReady = async (id, e) => {
    if(e) e.stopPropagation();
    
    // 1. Convertimos ID a String para evitar errores 10 vs "10"
    const idString = String(id);

    // 2. Bloqueamos el botón visualmente para que sepas que el click entró
    setProcessingId(id);

    // 3. Agregamos a la lista negra
    deletedIdsRef.current.add(idString);

    // 4. Lo borramos de la pantalla AL INSTANTE
    setOrders(prevOrders => prevOrders.filter((o) => String(o.id) !== idString));

    // 5. Enviamos la orden destructora al servidor
    const { error } = await supabase.rpc('eliminar_pedido', { pedido_id: id });
      
    if (error) {
      console.error("Error al borrar:", error);
      // Si falla, lo sacamos de la lista negra
      deletedIdsRef.current.delete(idString);
      setProcessingId(null);
    } else {
      setProcessingId(null);
    }
  };

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
          {orders.length} Pendientes
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-20 text-white/50">
            <CheckCircle size={60} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl">Todo despachado</h2>
          </div>
        ) : (
          orders.map((order) => (
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
                  disabled={processingId === order.id} // 🚫 EVITA DOBLE CLICK
                  className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg 
                    ${processingId === order.id ? 'bg-zinc-700 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-500 active:scale-95 text-white'}
                  `}
                >
                  {processingId === order.id ? (
                    <><Loader2 className="animate-spin" /> PROCESANDO...</>
                  ) : (
                    <><CheckCircle size={20} /> PEDIDO LISTO</>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}