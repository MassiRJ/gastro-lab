"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Receipt, Smartphone, Printer, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function CashierView() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [loadingPay, setLoadingPay] = useState(false);

  useEffect(() => {
    fetchPendingPayments();

    const channel = supabase.channel('caja_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchPendingPayments)
      .subscribe();
    
    const interval = setInterval(fetchPendingPayments, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchPendingPayments = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .neq('status', 'pagado') 
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const handleCobrar = (order) => {
    setSelectedOrder(order); 
  };

  const confirmPaymentAndPrint = async () => {
    if (!selectedOrder) return;
    setLoadingPay(true);

    try {
      // 1. GUARDAR EN BASE DE DATOS
      const { error } = await supabase
        .from('orders')
        .update({ status: 'pagado' })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // 2. IMPRIMIR (El truco mágico)
      // Damos un pequeño respiro para asegurar que el DOM esté listo y lanzamos la impresión
      setTimeout(() => {
        window.print(); 
        // Después de imprimir (o cancelar), cerramos el modal y limpiamos
        alert("✅ Pago registrado y Ticket enviado a impresora");
        setSelectedOrder(null);
        fetchPendingPayments(); 
      }, 500);

    } catch (error) {
      console.error("Error al cobrar:", error);
      alert("Error: " + error.message);
    } finally {
      setLoadingPay(false);
    }
  };

  const formatTable = (tableName) => {
    if (!tableName) return "Mesa ?";
    return tableName.toString().toLowerCase().includes('mesa') ? tableName : `Mesa ${tableName}`;
  };

  const getStatusBadge = (order) => {
    const isYape = order.payment_method?.toLowerCase().includes('yape') || order.payment_method?.toLowerCase().includes('transfer');
    if (isYape) return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/50 flex items-center gap-1"><Smartphone size={12}/> Verificar App</span>;
    return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs border border-red-500/50 flex items-center gap-1"><DollarSign size={12}/> Cobrar en Caja</span>;
  };

  return (
    <div className="min-h-screen p-6 text-white bg-zinc-950 relative">
      {/* --- ESTILOS DE IMPRESIÓN (CSS MÁGICO) --- */}
      <style jsx global>{`
        @media print {
          /* Ocultar TODO lo que no sea el voucher */
          body * { visibility: hidden; }
          #printable-voucher, #printable-voucher * { visibility: visible; }
          
          /* Posicionar el voucher para que ocupe toda la hoja y se vea limpio */
          #printable-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
            border: none;
            box-shadow: none;
          }
          /* Ocultar botones dentro del voucher al imprimir */
          .no-print { display: none !important; }
        }
      `}</style>

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Receipt className="text-emerald-500" /> Caja</h1>
        <div className="bg-emerald-900/50 px-4 py-2 rounded-lg border border-emerald-500/30">
          <span className="text-emerald-400 font-bold">{orders.length}</span> Mesas por cobrar
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-500"><p>No hay mesas pendientes de cobro.</p></div>
        ) : (
            orders.map((order) => (
            <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xl font-bold text-white">{formatTable(order.table_number)}</h3><p className="text-zinc-400 text-sm">Mozo: {order.waiter_name || "General"}</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-emerald-400">S/ {(order.total_price || 0).toFixed(2)}</p>{getStatusBadge(order)}</div>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-lg mb-4 text-sm text-zinc-300 max-h-32 overflow-y-auto">
                {order.items?.map((item, i) => (<div key={i} className="flex justify-between border-b border-zinc-800/50 last:border-0 py-1"><span>{item.title}</span><span>S/ {item.price}</span></div>))}
                </div>
                <div className="flex gap-2 items-center text-sm text-zinc-500 mb-4">Estado: <span className={`uppercase font-bold ${order.status === 'atendido' ? 'text-green-500' : 'text-orange-500'}`}>{order.status}</span></div>
                <button onClick={() => handleCobrar(order)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"><CreditCard size={18} /> Procesar Pago</button>
            </div>
            ))
        )}
      </div>

      {/* --- MODAL DE VOUCHER (CON ID para imprimir) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          {/* Este ID 'printable-voucher' es el que el CSS busca para imprimir */}
          <div id="printable-voucher" className="bg-white text-black p-6 rounded-lg w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            
            <div className="text-center border-b-2 border-dashed border-zinc-300 pb-4 mb-4">
              <h2 className="text-2xl font-bold uppercase">Gastro Lab</h2>
              <p className="text-xs text-zinc-500">RUC: 20123456789</p>
              <p className="text-xs text-zinc-500">Ticket #{selectedOrder.id.toString().slice(-6)}</p>
            </div>

            <div className="space-y-2 mb-4 text-sm font-mono">
              <div className="flex justify-between"><span>Mesa:</span> <span>{formatTable(selectedOrder.table_number)}</span></div>
              <div className="flex justify-between"><span>Fecha:</span> <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span></div>
              <hr className="border-dashed border-zinc-300 my-2"/>
              {selectedOrder.items && selectedOrder.items.map((item, i) => (
                 <div key={i} className="flex justify-between"><span>{item.title}</span><span>{item.price}</span></div>
              ))}
              <hr className="border-zinc-800 my-2"/>
              <div className="flex justify-between text-xl font-bold"><span>TOTAL:</span><span>S/ {(selectedOrder.total_price || 0).toFixed(2)}</span></div>
              <div className="text-center mt-2 text-xs bg-zinc-100 p-1 rounded">Método: {selectedOrder.payment_method?.toUpperCase() || "EFECTIVO"}</div>
              <div className="text-center mt-4 text-xs">¡Gracias por su visita!</div>
            </div>

            {/* Botones (Clase 'no-print' para que no salgan en el papel) */}
            <div className="flex gap-2 mt-6 no-print">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 border border-zinc-300 py-3 rounded font-bold hover:bg-zinc-100" disabled={loadingPay}>Cancelar</button>
              <button onClick={confirmPaymentAndPrint} className="flex-1 bg-black text-white py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50" disabled={loadingPay}>
                {loadingPay ? "Procesando..." : <><Printer size={18}/> Emitir e Imprimir</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
