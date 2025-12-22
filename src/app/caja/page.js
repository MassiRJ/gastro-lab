"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // --- NUEVO: Para redirigir
import { DollarSign, CreditCard, Receipt, Smartphone, Printer, MapPin, FileText, TrendingUp, X, Calendar, User, Eye, Users, Clock, Mail, Phone, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function CashierView() {
  const router = useRouter(); // --- NUEVO
  const [authorized, setAuthorized] = useState(false); // --- NUEVO: Estado de autorización

  // Estados Cobro
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [loadingPay, setLoadingPay] = useState(false);

  // Estados Reporte
  const [showReport, setShowReport] = useState(false);
  const [salesHistory, setSalesHistory] = useState([]);
  const [reportTotal, setReportTotal] = useState(0);
  const [paymentBreakdown, setPaymentBreakdown] = useState({ efectivo: 0, yape: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Estado Detalle
  const [viewDetail, setViewDetail] = useState(null);

  // --- NUEVO: EFECTO DE PROTECCIÓN (EL CANDADO) ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Si no hay sesión, manda al login
      } else {
        setAuthorized(true); // Si hay sesión, muestra la página
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!authorized) return; // No cargar datos si no está autorizado

    fetchPendingPayments();
    const channel = supabase.channel('caja_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, updateData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, updateData)
      .subscribe();
    const interval = setInterval(fetchPendingPayments, 3000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [showReport, selectedDate, authorized]); // Agregamos authorized

  const updateData = () => {
    fetchPendingPayments();
    if (showReport) fetchDailyReport();
  };

  useEffect(() => { if (showReport && authorized) fetchDailyReport(); }, [selectedDate, authorized]);

  // --- SI NO ESTÁ AUTORIZADO, MUESTRA PANTALLA NEGRA DE CARGA ---
  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  // --- DESDE AQUÍ ES TU CÓDIGO EXACTO DE ANTES ---
  const fetchPendingPayments = async () => {
    const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .neq('status', 'pagado')
        .neq('status', 'completado') 
        .order("created_at", { ascending: false });

    const { data: reservData } = await supabase
        .from("reservations")
        .select("*")
        .eq('payment_status', 'pending') 
        .order("created_at", { ascending: false });

    const formattedReservs = (reservData || []).map(r => ({
        id: r.id,
        table_number: "RESERVA WEB", 
        waiter_name: r.name, 
        total_price: r.paid_amount || 50.00, 
        payment_method: r.payment_method || 'Yape',
        status: r.status,
        type: 'reserva_pendiente', 
        items: [ 
            { title: `Reserva ${r.people} pax`, price: (r.paid_amount || 50).toFixed(2) },
            { title: `Fecha: ${r.date} - ${r.time}`, price: "" }
        ]
    }));

    if (ordersData || reservData) {
        setOrders([...(ordersData || []), ...formattedReservs]);
    }
  };

  const handleCobrar = (order) => setSelectedOrder(order);

  const confirmPaymentAndPrint = async () => {
    if (!selectedOrder) return;
    setLoadingPay(true);
    try {
      if (selectedOrder.type === 'reserva_pendiente') {
          const { error } = await supabase
            .from('reservations')
            .update({ 
                payment_status: 'pagado', 
                status: 'confirmada'      
            })
            .eq('id', selectedOrder.id);
          if (error) throw error;
          alert("✅ Garantía confirmada exitosamente");
      } else {
          const { error } = await supabase
            .from('orders')
            .update({ status: 'pagado' }) 
            .eq('id', selectedOrder.id);
          if (error) throw error;
      }
      
      setTimeout(() => { 
          if(selectedOrder.type !== 'reserva_pendiente') window.print(); 
          setSelectedOrder(null); 
          fetchPendingPayments(); 
      }, 500);

    } catch (error) { 
        alert("Error: " + error.message); 
    } finally { 
        setLoadingPay(false); 
    }
  };

  const fetchDailyReport = async () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

    const { data: ordersData } = await supabase.from("orders").select("*").eq('status', 'pagado').gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());
    const { data: reservData } = await supabase.from("reservations").select("*").eq('payment_status', 'pagado').gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());

    const validOrders = ordersData || [];
    const validReservs = reservData || [];

    const formattedReservs = validReservs.map(res => ({
      id: `R-${res.id}`,
      created_at: res.created_at,
      table_number: "RESERVA WEB",
      total_price: res.paid_amount || 50,
      payment_method: res.payment_method || 'Yape',
      type: 'reserva',
      client_name: res.name,
      res_date: res.date,
      res_time: res.time,
      res_guests: res.people,
      res_phone: res.phone
    }));

    const combinedData = [...validOrders, ...formattedReservs];
    combinedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setSalesHistory(combinedData);

    const total = combinedData.reduce((sum, item) => sum + (item.total_price || 0), 0);
    setReportTotal(total);

    const breakdown = combinedData.reduce((acc, item) => {
      const method = item.payment_method?.toLowerCase() || 'efectivo';
      if (method.includes('yape') || method.includes('plin') || method.includes('tarjeta')) { acc.yape += (item.total_price || 0); } 
      else { acc.efectivo += (item.total_price || 0); }
      return acc;
    }, { efectivo: 0, yape: 0 });
    setPaymentBreakdown(breakdown);
  };

  const openReport = () => { setShowReport(true); fetchDailyReport(); };
  const formatTable = (tableName) => tableName?.toString().toLowerCase().includes('mesa') || tableName === "RESERVA WEB" ? tableName : `Mesa ${tableName}`;
  
  const getStatusBadge = (order) => {
    if (order.type === 'reserva_pendiente') {
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs border border-purple-500/50 flex items-center gap-1"><Smartphone size={12}/> Confirmar Abono</span>;
    }
    const isYape = order.payment_method?.toLowerCase().includes('yape');
    if (isYape) return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/50 flex items-center gap-1"><Smartphone size={12}/> Yape/App</span>;
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
            <button onClick={openReport} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg border border-zinc-700 flex items-center gap-2 font-bold transition-all"><FileText size={18} /> Cierre / Reportes</button>
            <div className="bg-emerald-900/50 px-4 py-2 rounded-lg border border-emerald-500/30"><span className="text-emerald-400 font-bold">{orders.length}</span> Pendientes</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (<div className="col-span-full text-center py-20 text-zinc-500"><p>No hay cobros pendientes.</p></div>) : (
            orders.map((order) => (
            <div key={order.id} className={`border rounded-xl p-6 transition-all animate-in fade-in zoom-in duration-300 ${order.type === 'reserva_pendiente' ? 'bg-zinc-900 border-purple-500/30 hover:border-purple-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className={`text-xl font-bold ${order.type === 'reserva_pendiente' ? 'text-purple-400' : 'text-white'}`}>{formatTable(order.table_number)}</h3>
                        <p className="text-zinc-400 text-sm">Cliente: {order.waiter_name || "General"}</p>
                    </div>
                    <div className="text-right"><p className="text-2xl font-bold text-emerald-400">S/ {(order.total_price || 0).toFixed(2)}</p>{getStatusBadge(order)}</div>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-lg mb-4 text-sm text-zinc-300 max-h-32 overflow-y-auto">
                    {order.items?.map((item, i) => (<div key={i} className="flex justify-between border-b border-zinc-800/50 last:border-0 py-1"><span>{item.title}</span><span>{item.price ? `S/ ${item.price}` : ''}</span></div>))}
                </div>
                <button 
                    onClick={() => handleCobrar(order)} 
                    className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform ${order.type === 'reserva_pendiente' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                >
                    {order.type === 'reserva_pendiente' ? <><CheckCircle size={18}/> Validar Abono</> : <><CreditCard size={18}/> Procesar Pago</>}
                </button>
            </div>
            ))
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div id="printable-voucher" className="bg-white text-black p-6 rounded-lg w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="text-center border-b-2 border-dashed border-zinc-300 pb-4 mb-4">
              <h2 className="text-2xl font-bold uppercase">Gastro Lab</h2>
              <p className="text-xs text-zinc-500">
                  {selectedOrder.type === 'reserva_pendiente' ? 'CONFIRMACIÓN RESERVA' : `Ticket #${selectedOrder.id.toString().slice(-6)}`}
              </p>
            </div>
            <div className="space-y-2 mb-4 text-sm font-mono">
              <div className="flex justify-between"><span>Origen:</span> <span>{formatTable(selectedOrder.table_number)}</span></div>
              <div className="flex justify-between"><span>Cliente:</span> <span>{selectedOrder.waiter_name}</span></div>
              <div className="flex justify-between"><span>Fecha:</span> <span>{new Date().toLocaleDateString()}</span></div>
              <hr className="border-dashed border-zinc-300 my-2"/>
              {selectedOrder.items && selectedOrder.items.map((item, i) => (<div key={i} className="flex justify-between"><span>{item.title}</span><span>{item.price}</span></div>))}
              <hr className="border-zinc-800 my-2"/>
              <div className="flex justify-between text-xl font-bold"><span>TOTAL:</span><span>S/ {(selectedOrder.total_price || 0).toFixed(2)}</span></div>
              <div className="text-center mt-2 text-xs bg-zinc-100 p-1 rounded">Método: {selectedOrder.payment_method?.toUpperCase() || "EFECTIVO"}</div>
            </div>
            
            {selectedOrder.type === 'reserva_pendiente' && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-4 text-xs">
                    <p className="font-bold">⚠️ Atención Cajero:</p>
                    <p>Verifica que el dinero (S/ 50.00) haya llegado a la cuenta antes de confirmar.</p>
                </div>
            )}

            <div className="flex gap-2 mt-6 no-print">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 border border-zinc-300 py-3 rounded font-bold hover:bg-zinc-100" disabled={loadingPay}>Cancelar</button>
              <button onClick={confirmPaymentAndPrint} className={`flex-1 py-3 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-white ${selectedOrder.type === 'reserva_pendiente' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-black hover:bg-zinc-800'}`} disabled={loadingPay}>
                  {loadingPay ? "..." : (selectedOrder.type === 'reserva_pendiente' ? "Confirmar Ingreso" : <><Printer size={18}/> Emitir</>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-3xl h-[90vh] rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 border border-zinc-800 relative">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2"><TrendingUp className="text-emerald-500"/> Cierre de Caja</h2>
                  <div className="flex items-center gap-2 bg-black border border-zinc-700 px-3 py-1 rounded-lg">
                    <Calendar size={16} className="text-zinc-400"/>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-white text-sm outline-none cursor-pointer"/>
                  </div>
                </div>
                <button onClick={() => setShowReport(false)} className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors"><X size={20}/></button>
            </div>

            <div id="printable-report" className="flex-1 overflow-y-auto p-6 space-y-6 text-black bg-white md:bg-transparent md:text-white">
                <div className="text-center md:hidden block mb-4 border-b pb-2"><h2 className="text-xl font-bold">REPORTE DE CIERRE</h2><p>Fecha: {selectedDate}</p></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-600/20 border border-emerald-500/50 p-4 rounded-xl text-center md:text-white text-black border-black/10 md:border-emerald-500/50 bg-gray-100 md:bg-emerald-600/20">
                        <p className="text-sm opacity-70">Total Ingresos</p>
                        <p className="text-4xl font-bold text-emerald-500">S/ {reportTotal.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-zinc-100 md:bg-zinc-800 rounded md:text-white text-black"><span>💵 Efectivo:</span><span className="font-bold">S/ {paymentBreakdown.efectivo.toFixed(2)}</span></div>
                        <div className="flex justify-between p-2 bg-zinc-100 md:bg-zinc-800 rounded md:text-white text-black"><span>📱 Yape/Plin:</span><span className="font-bold">S/ {paymentBreakdown.yape.toFixed(2)}</span></div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-4 border-b pb-2 md:text-white text-black">Detalle de Operaciones ({salesHistory.length})</h3>
                    {salesHistory.length === 0 ? (<p className="text-center text-zinc-500 py-4">No se encontraron movimientos.</p>) : (
                      <table className="w-full text-sm text-left md:text-white text-black border-collapse">
                          <thead>
                              <tr className="border-b border-zinc-700 opacity-50">
                                  <th className="pb-2">Hora</th>
                                  <th className="pb-2">Origen</th>
                                  <th className="pb-2">Total</th>
                                  <th className="pb-2 text-right">Método</th>
                                  <th className="pb-2 text-center">Info</th>
                              </tr>
                          </thead>
                          <tbody>
                              {salesHistory.map((tx) => (
                                  <tr key={tx.id} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                                      <td className="py-2">{new Date(tx.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                                      <td className="py-2 flex items-center gap-2">
                                        {tx.type === 'reserva' ? (<><User size={14} className="text-blue-400"/> {tx.client_name || "Reserva Web"}</>) 
                                        : (<><MapPin size={14} className="text-yellow-400"/> {formatTable(tx.table_number)}</>)}
                                      </td>
                                      <td className="py-2 font-bold">S/ {tx.total_price.toFixed(2)}</td>
                                      <td className="py-2 text-right uppercase text-xs">{tx.payment_method || "EFECTIVO"}</td>
                                      <td className="py-2 text-center">
                                          <button onClick={() => setViewDetail(tx)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-1.5 rounded-md transition-colors no-print border border-zinc-700" title="Ver Detalles">
                                            <Eye size={14}/>
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-900 rounded-b-2xl no-print">
                <button onClick={() => setShowReport(false)} className="px-6 py-3 rounded-lg font-bold border border-zinc-700 hover:bg-zinc-800 text-white">Cerrar</button>
                <button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"><Printer size={18}/> Imprimir Reporte</button>
            </div>

            {viewDetail && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-8 animate-in fade-in duration-200 rounded-2xl">
                <div className="bg-zinc-950 border border-zinc-700 p-6 rounded-xl w-full max-w-sm shadow-2xl relative">
                  <button onClick={() => setViewDetail(null)} className="absolute top-2 right-2 bg-zinc-800 p-1 rounded-full text-zinc-400 hover:text-white"><X size={16}/></button>
                  
                  {viewDetail.type === 'reserva' ? (
                    <div className="space-y-4">
                       <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2"><User size={20}/> Reserva Web</h3>
                       <div className="space-y-2 text-sm text-zinc-300">
                          <p><span className="text-zinc-500 block text-xs uppercase">Cliente:</span> {viewDetail.client_name}</p>
                          <p><span className="text-zinc-500 block text-xs uppercase">Fecha Reserva:</span> {viewDetail.res_date} - {viewDetail.res_time}</p>
                          <p><span className="text-zinc-500 block text-xs uppercase">Invitados:</span> {viewDetail.res_guests} personas</p>
                          <p><span className="text-zinc-500 block text-xs uppercase">Teléfono:</span> {viewDetail.res_phone}</p>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2"><MapPin size={20}/> {formatTable(viewDetail.table_number)}</h3>
                       <p className="text-xs text-zinc-500">ID Venta: {viewDetail.id}</p>
                       <div className="bg-zinc-900 rounded-lg p-3 max-h-60 overflow-y-auto">
                          <p className="text-xs font-bold text-zinc-400 mb-2 uppercase">Consumo:</p>
                          <ul className="space-y-2 text-sm">
                            {viewDetail.items && viewDetail.items.map((item, i) => (
                              <li key={i} className="flex justify-between border-b border-zinc-800 pb-1 last:border-0">
                                <span>{item.title}</span><span className="text-zinc-400">S/ {item.price}</span>
                              </li>
                            ))}
                          </ul>
                       </div>
                       <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
                          <span>Total Pagado:</span><span>S/ {viewDetail.total_price.toFixed(2)}</span>
                       </div>
                    </div>
                  )}
                  <div className="mt-6"><button onClick={() => setViewDetail(null)} className="w-full bg-zinc-800 hover:bg-zinc-700 py-2 rounded font-bold text-sm">Cerrar Detalle</button></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}