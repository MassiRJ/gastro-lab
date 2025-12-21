"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Utensils, MapPin, Clock } from "lucide-react"; 
import { supabase } from "../../lib/supabaseClient";
import { marcarPedidoAtendido } from "./actions"; // Importamos la acción

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    // Carga inicial y suscripción en tiempo real
    fetchOrders();
    const channel = supabase.channel('cocina_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fetchOrders = async () => {
    // SOLO TRAEMOS LO PENDIENTE
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
      // Optimistic update: lo quitamos visualmente al instante
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoadingId(null);
    }
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
            <div key={order.id} className="bg-zinc-900 border-l-4 border-orange-500 rounded-r-xl shadow-lg flex flex-col">
              <div className="bg-zinc-800 p-3 flex justify-between items-center">
                  <h3 className="font-bold text-xl flex items-center gap-2"><MapPin className="text-yellow-500"/> Mesa {order.table_number}</h3>
                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-1"><Clock size={12}/> {new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="p-4 flex-1">
                <ul className="space-y-2">{order.items?.map((item, i) => (<li key={i} className="flex gap-2 border-b border-zinc-800 pb-1"><span className="text-orange-500 font-bold">1x</span> {item.title}</li>))}</ul>
              </div>
              <button 
                onClick={() => handleListo(order.id)} 
                disabled={loadingId === order.id}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 flex justify-center gap-2 disabled:opacity-50"
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
