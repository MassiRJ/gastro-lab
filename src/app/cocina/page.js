"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, CreditCard, DollarSign, RefreshCw } from "lucide-react";

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date()); // Para efecto visual

  // --- LÓGICA DE AUTO-REFRESCO (POLLING) ---
  useEffect(() => {
    // Función que lee la memoria
    const fetchOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("kitchen_orders") || "[]");
      
      // Actualizamos solo si hay cambios (para evitar parpadeos innecesarios)
      // En un proyecto real haríamos una comparación más profunda, 
      // pero aquí React se encarga de optimizar si el array es igual.
      setOrders(savedOrders);
      setLastUpdate(new Date());
    };

    // 1. Carga inicial inmediata
    fetchOrders();

    // 2. Programar la actualización cada 2 segundos (2000 ms)
    const interval = setInterval(fetchOrders, 2000);

    // 3. Limpieza (Importante para no dejar procesos corriendo)
    return () => clearInterval(interval);
  }, []);

  const completeOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem("kitchen_orders", JSON.stringify(updatedOrders));
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      {/* Header de la Cocina */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            👨‍🍳 KDS <span className="text-yellow-500">Cocina</span>
            {/* Indicador visual de "En vivo" */}
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h1>
          <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
            <RefreshCw size={12} className="animate-spin" /> Sincronizando en tiempo real...
          </p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-500">{orders.length}</p>
          </div>
          <div className="h-10 w-px bg-zinc-700"></div>
          <Clock className="text-gray-500" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-50 animate-pulse">
          <CheckCircle size={64} className="mb-4 text-zinc-700" />
          <p className="text-2xl font-bold">Todo despachado, Chef.</p>
          <p>Esperando nuevos pedidos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* CABECERA DEL TICKET */}
              <div className={`p-4 flex justify-between items-start border-b border-zinc-700 ${
                  order.paymentStatus === "PENDIENTE" ? "bg-orange-900/20" : "bg-zinc-800"
                }`}>
                <div>
                  <h3 className="font-bold text-xl text-white">
                    {order.type === "mesa" ? `Mesa ${order.table}` : "🛵 DELIVERY"}
                  </h3>
                  <span className="text-xs font-mono text-gray-400">#{order.id.toString().slice(-4)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-bold text-yellow-500">{order.time}</span>
                </div>
              </div>

              {/* LISTA DE PLATOS */}
              <div className="p-5 flex-1 space-y-4 bg-zinc-900/50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <div className="w-6 h-6 bg-yellow-500/10 text-yellow-500 rounded flex items-center justify-center text-xs font-bold mt-1">
                      1
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* INFO DE PAGO Y ACCIÓN */}
              <div className="bg-zinc-950 p-4 border-t border-zinc-800 space-y-3">
                
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Total:</span>
                      <span className="text-white font-bold">S/ {order.total.toFixed(2)}</span>
                   </div>
                   
                   {/* ET IQUETAS DE ESTADO */}
                   {order.paymentStatus === "PAGADO" && (
                     <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                       <CreditCard size={12} /> PAGADO
                     </div>
                   )}

                   {order.paymentStatus === "PENDIENTE" && (
                     <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30 animate-pulse">
                       <DollarSign size={12} /> COBRAR
                     </div>
                   )}
                </div>

                <button 
                  onClick={() => completeOrder(order.id)}
                  className="w-full py-3 bg-zinc-800 hover:bg-green-600 hover:text-white text-gray-300 font-bold rounded-lg transition-all flex justify-center items-center gap-2 group"
                >
                  <CheckCircle size={18} className="group-hover:scale-110 transition-transform"/> 
                  MARCAR LISTO
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}