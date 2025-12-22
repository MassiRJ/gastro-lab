"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Utensils, MapPin, Clock } from "lucide-react"; 
import { supabase } from "../../lib/supabaseClient";
import { marcarPedidoAtendido } from "./actions"; 

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchOrders();

    // 1. INTENTO DE REALTIME (Si está activado en Supabase)
    const channel = supabase.channel('cocina_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    // 2. PLAN B: REFRESCO AUTOMÁTICO CADA 3 SEGUNDOS (Infalible)
    const interval = setInterval(fetchOrders, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq('status', 'pendiente') 
      .order("created_at", { ascending: true });
    if (data) setOrders(data);
  };

  const handleListo = async (id) => {
    setLoadingId(id);
    try {
      await marcarPedidoAtendido(id);
      // Lo quitamos visualmente al instante para que se sienta rápido
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoadingId(null);
    }
  };

  // Función para formatear la mesa correctamente
  const formatTable = (tableName) => {
    if (!tableName) return "Mesa ?";
    // Si ya dice "Mesa", no lo repetimos. Si es solo un número "1", le agregamos "Mesa "
    return tableName.toString().toLowerCase().includes('mesa') ? tableName : `Mesa ${tableName}`;
  };

  return (
    <div className="min-h-screen p-6 text-white bg-zinc-950">
      <header className="flex justify-between items-center mb-8 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Utensils className="text-orange-500" /> Cocina</h1>
        <div className="bg-orange-600 px-4 py-1 rounded-full font-bold">{orders.length} Por preparar</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.length === 0 ? (
           <div className="col-span-full text-center py-20 text-zinc-500"><CheckCircle size={60} className="mx-auto mb-4" /><h2 className="text-2xl">Todo despachado</h2></div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border-l-4 border-orange-500 rounded-r-xl shadow-lg flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="bg-zinc-800 p-3 flex justify-between items-center">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <MapPin className="text-yellow-500"/> 
                    {formatTable(order.table_number)}
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-1"><Clock size={12}/> {new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="p-4 flex-1">
                <ul className="space-y-2">{order.items?.map((item, i) => (<li key={i} className="flex gap-2 border-b border-zinc-800 pb-1"><span className="text-orange-500 font-bold">1x</span> {item.title}</li>))}</ul>
              </div>
              <button 
                onClick={() => handleListo(order.id)} 
                disabled={loadingId === order.id}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 flex justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
              >
                  {loadingId === order.id ? "Procesando..." : "PEDIDO LISTO"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
