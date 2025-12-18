"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, Utensils, Flame, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function KitchenDisplay() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  
  // Login
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

    // Auto-refresco cada 5 seg
    const interval = setInterval(() => { if (session) fetchOrders(); }, 5000);
    return () => clearInterval(interval);
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión..."); // Chivato en consola

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // SI HAY ERROR, QUE NOS AVISE
        alert("❌ Error al entrar: " + error.message);
        console.error("Error Supabase:", error);
        setLoginError(error.message); // Si usas el estado de error visual
      } else {
        // SI TODO VA BIEN
        console.log("Login exitoso:", data);
        setSession(data.session);
        fetchOrders();
      }
    } catch (err) {
      // SI CRASHEA EL CÓDIGO
      alert("🔥 Error Crítico: " + err.message);
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    // Traemos pedidos pendientes de la tabla ORDERS
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq('status', 'pendiente') 
      .order("created_at", { ascending: true });
    
    if (data) setOrders(data);
  };

  // --- AQUÍ ESTÁ LA FUNCIÓN CORREGIDA Y SEGURA ---
  const markAsReady = async (id) => {
    // 1. Confirmación rápida (opcional)
    const confirmar = window.confirm("¿Despachar y borrar pedido?");
    if (!confirmar) return;

    // 2. Llamamos a la función destructora (RPC)
    const { error } = await supabase.rpc('eliminar_pedido', { 
      pedido_id: id 
    });
      
    if (error) {
      // Si falla aquí, dime QUÉ DICE esta alerta
      alert("❌ Error RPC: " + error.message);
      console.error(error);
    } else {
      // 3. Éxito: Lo borramos de la pantalla a la fuerza
      setOrders(prevOrders => prevOrders.filter((o) => o.id !== id));
    }
  };

  const Background = () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-900 via-red-900 to-rose-900 opacity-90"></div>
  );

  // --- LOGIN SIMPLE ---
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

  // --- DASHBOARD COCINA ---
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
              
              {/* Encabezado del Ticket */}
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
                  <p className="text-xs text-gray-500">hace {Math.floor((new Date() - new Date(order.created_at))/60000)} min</p>
                </div>
              </div>

              {/* Lista de Platos (JSON) */}
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

              {/* Pie del Ticket */}
              <div className="p-3 bg-zinc-800 border-t border-zinc-700">
                <button 
                  onClick={() => markAsReady(order.id)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle size={18} /> PEDIDO LISTO
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}