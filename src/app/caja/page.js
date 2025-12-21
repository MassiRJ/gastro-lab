"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Receipt, Smartphone, Printer, MapPin, FileText, TrendingUp, X, Calendar } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function CashierView() {
  // Estados para Cobro
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [loadingPay, setLoadingPay] = useState(false);

  // Estados para Reporte (Histórico)
  const [showReport, setShowReport] = useState(false);
  const [salesHistory, setSalesHistory] = useState([]);
  const [reportTotal, setReportTotal] = useState(0);
  const [paymentBreakdown, setPaymentBreakdown] = useState({ efectivo: 0, yape: 0 });
  
  // FECHA SELECCIONADA (Por defecto HOY)
  // Usamos el formato YYYY-MM-DD para el input tipo date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchPendingPayments();

    const channel = supabase.channel('caja_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchPendingPayments();
        // Si el reporte está abierto y es de HOY, actualízalo en tiempo real
        if (showReport && selectedDate === new Date().toISOString().split('T')[0]) {
            fetchDailyReport(); 
        }
      })
      .subscribe();
    
    const interval = setInterval(fetchPendingPayments, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [showReport, selectedDate]);

  // Si cambia la fecha seleccionada en el reporte, recargamos los datos
  useEffect(() => {
    if (showReport) fetchDailyReport();
  }, [selectedDate]);

  // --- LOGICA COBRO ---
  const fetchPendingPayments = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .neq('status', 'pagado') 
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const handleCobrar = (order) => { setSelectedOrder(order); };

  const confirmPaymentAndPrint = async () => {
    if (!selectedOrder) return;
    setLoadingPay(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'pagado' })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      setTimeout(() => {
        window.print(); 
        alert("✅ Pago registrado y Ticket enviado");
        setSelectedOrder(null);
        fetchPendingPayments(); 
      }, 500);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoadingPay(false);
    }
  };

  // --- LOGICA REPORTE HISTÓRICO ---
  const fetchDailyReport = async () => {
    // Convertimos la fecha del input (YYYY-MM-DD) a rangos de tiempo
    // Truco: creamos la fecha usando split para evitar problemas de zona horaria
    const [year, month, day] = selectedDate.split('-').map(Number);
    
    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0); // 00:00:00
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999); // 23:59:59

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq('status', 'pagado')
      .gte('created_at', startDate.toISOString()) // Desde las 00:00
      .lte('created_at', endDate.toISOString())   // Hasta las 23:59
      .order("created_at", { ascending: false });

    if (data) {
      setSalesHistory(data);
      const total = data.reduce((sum, item) => sum + (item.total_price || 0), 0);
      setReportTotal(total);

      const breakdown = data.reduce((acc, item) => {
        const method = item.payment_method?.toLowerCase() || 'efectivo';
        if (method.includes('yape') || method.includes('transfer')) {
          acc.yape += (item.total_price || 0);
        } else {
          acc.efectivo += (item.total_price || 0);
        }
        return acc;
      }, { efectivo: 0, yape: 0 });
      setPaymentBreakdown(breakdown);
    }
  };

  const openReport = () => {
    // Al abrir, reseteamos a HOY por si acaso, o dejamos la última vista
    // setSelectedDate(new Date().toISOString().split('T')[0]); 
    setShowReport(true);
    fetchDailyReport();
  };

  // --- UTILIDADES ---
  const formatTable = (tableName) => tableName?.toString().toLowerCase().includes('mesa') ? tableName : `Mesa ${tableName}`;
  
  const getStatusBadge = (order) => {
    const isYape = order.payment_method?.toLowerCase().includes('yape');
    if (isYape) return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/50 flex items-center gap-1"><Smartphone size={12}/> Yape/Plin</span>;
    return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs border border-red-500/50 flex items-center gap-1"><DollarSign size={12}/> Efectivo</span>;
  };

  return (
    <div className="min-h-screen p-6 text-white bg-zinc-950 relative">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-voucher, #printable-voucher * { visibility: visible; }
          #printable-voucher { position: absolute; left: 0; top: 0; width: 100%; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Receipt className="text-emerald-500" /> Caja</h1>
        <div className="flex gap-4">
            <button onClick={openReport} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg border border-zinc-700 flex items-center gap-2 font-bold transition-all">
                <FileText size={18} /> Reportes / Cierre
            </button>
            <div className="bg-emerald-900/50 px-4 py-2 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-bold">{orders.length}</span> Pendientes
            </div>
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
                <button onClick={() => handleCobrar(order)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"><CreditCard size={18} /> Procesar Pago</button>
            </div>
            ))
        )}
      </div>

      {/* --- MODAL VOUCHER --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
              {selectedOrder.items && selectedOrder.items.map((item, i) => (<div key={i} className="flex justify-between"><span>{item.title}</span><span>{item.price}</span></div>))}
              <hr className="border-zinc-800 my-2"/>
              <div className="flex justify-between text-xl font-bold"><span>TOTAL:</span><span>S/ {(selectedOrder.total_price || 0).toFixed(2)}</span></div>
              <div className="text-center mt-2 text-xs bg-zinc-100 p-1 rounded">Método: {selectedOrder.payment_method?.toUpperCase() || "EFECTIVO"}</div>
            </div>
            <div className="flex gap-2 mt-6 no-print">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 border border-zinc-300 py-3 rounded font-bold hover:bg-zinc-100" disabled={loadingPay}>Cancelar</button>
              <button onClick={confirmPaymentAndPrint} className="flex-1 bg-black text-white py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 disabled:opacity-50" disabled={loadingPay}>{loadingPay ? "..." : <><Printer size={18}/> Emitir</>}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL REPORTE HISTÓRICO --- */}
      {showReport && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-2xl h-[90vh] rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 border border-zinc-800">
            
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-emerald-500"/> Reporte de Ventas</h2>
                  {/* SELECTOR DE FECHA MÁGICO */}
                  <div className="flex items-center gap-2 bg-black border border-zinc-700 px-3 py-1 rounded-lg">
                    <Calendar size={16} className="text-zinc-400"/>
                    <input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-white text-sm outline-none cursor-pointer"
                    />
                  </div>
                </div>
                <button onClick={() => setShowReport(false)} className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X size={20}/></button>
            </div>

            <div id="printable-report" className="flex-1 overflow-y-auto p-6 space-y-6 text-black bg-white md:bg-transparent md:text-white">
                <div className="text-center md:hidden block mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold">REPORTE DE CIERRE</h2>
                    <p>Fecha: {selectedDate}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-600/20 border border-emerald-500/50 p-4 rounded-xl text-center md:text-white text-black border-black/10 md:border-emerald-500/50 bg-gray-100 md:bg-emerald-600/20">
                        <p className="text-sm opacity-70">Ventas del Día</p>
                        <p className="text-4xl font-bold text-emerald-500">S/ {reportTotal.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-zinc-100 md:bg-zinc-800 rounded md:text-white text-black"><span>💵 Efectivo:</span><span className="font-bold">S/ {paymentBreakdown.efectivo.toFixed(2)}</span></div>
                        <div className="flex justify-between p-2 bg-zinc-100 md:bg-zinc-800 rounded md:text-white text-black"><span>📱 Yape/Plin:</span><span className="font-bold">S/ {paymentBreakdown.yape.toFixed(2)}</span></div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-4 border-b pb-2 md:text-white text-black">Detalle de Operaciones ({salesHistory.length})</h3>
                    {salesHistory.length === 0 ? (
                      <p className="text-center text-zinc-500 py-4">No se encontraron ventas en esta fecha.</p>
                    ) : (
                      <table className="w-full text-sm text-left md:text-white text-black">
                          <thead>
                              <tr className="border-b border-zinc-700 opacity-50">
                                  <th className="pb-2">Hora</th>
                                  <th className="pb-2">Mesa</th>
                                  <th className="pb-2">Total</th>
                                  <th className="pb-2 text-right">Método</th>
                              </tr>
                          </thead>
                          <tbody>
                              {salesHistory.map((tx) => (
                                  <tr key={tx.id} className="border-b border-zinc-800/50">
                                      <td className="py-2">{new Date(tx.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                                      <td className="py-2">{formatTable(tx.table_number)}</td>
                                      <td className="py-2 font-bold">S/ {tx.total_price}</td>
                                      <td className="py-2 text-right uppercase text-xs">{tx.payment_method || "EFECTIVO"}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-900 rounded-b-2xl no-print">
                <button onClick={() => setShowReport(false)} className="px-6 py-3 rounded-lg font-bold border border-zinc-700 hover:bg-zinc-800 text-white">Cerrar</button>
                <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
                    <Printer size={18}/> Imprimir Reporte
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
