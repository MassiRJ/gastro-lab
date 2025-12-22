"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { 
  DollarSign, Calendar, Clock, Users, CheckCircle, 
  XCircle, RefreshCw, Smartphone, CreditCard, Banknote,
  Utensils, LayoutGrid, ClipboardList
} from "lucide-react";

export default function CashierPage() {
  // ESTADOS
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'reservations'

  // CARGAR DATOS
  useEffect(() => {
    fetchData();
    // Suscripción en tiempo real
    const channel = supabase
      .channel('realtime_caja')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Traer Pedidos (Comida)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Traer Reservas (Garantías)
    const { data: reservationsData } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    setOrders(ordersData || []);
    setReservations(reservationsData || []);
    setLoading(false);
  };

  // ACCIONES DE CAJA
  const confirmOrderPayment = async (id) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'pagado', status: 'completado' })
      .eq('id', id);
    if (!error) alert("✅ Pago de pedido confirmado");
  };

  // ACCIÓN CLAVE: CONFIRMAR GARANTÍA DE RESERVA
  const confirmReservationPayment = async (id, currentStatus) => {
    if (currentStatus === 'pagado') return;

    const confirm = window.confirm("¿Confirmas que recibiste los S/ 50.00 de garantía?");
    if (!confirm) return;

    const { error } = await supabase
      .from('reservations')
      .update({ 
        payment_status: 'pagado', 
        status: 'confirmada' // Cambiamos estado de reserva a confirmada
      })
      .eq('id', id);

    if (!error) alert("✅ Garantía confirmada. Reserva asegurada.");
  };

  // CÁLCULOS FINANCIEROS
  const totalVentasComida = orders
    .filter(o => o.payment_status === 'pagado')
    .reduce((sum, o) => sum + o.total_price, 0);

  const totalGarantias = reservations
    .filter(r => r.payment_status === 'pagado' || r.payment_status === 'confirmada') // Ajusta según cómo guardes el status
    .reduce((sum, r) => sum + (r.paid_amount || 0), 0);

  const granTotal = totalVentasComida + totalGarantias;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
      
      {/* HEADER CAJA */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-zinc-800 pb-6 gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white">
            Caja <span className="text-amber-500">Central</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Gestión de Ingresos y Reservas</p>
        </div>

        {/* TARJETAS DE TOTALES */}
        <div className="flex gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Ventas Comida</p>
                <p className="text-2xl font-mono text-emerald-400">S/ {totalVentasComida.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Garantías Reservas</p>
                <p className="text-2xl font-mono text-amber-500">S/ {totalGarantias.toFixed(2)}</p>
            </div>
            <div className="bg-white text-black p-4 rounded-xl shadow-lg shadow-white/10">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Caja</p>
                <p className="text-3xl font-black">S/ {granTotal.toFixed(2)}</p>
            </div>
        </div>
      </header>

      {/* TABS DE NAVEGACIÓN */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
        >
          <Utensils size={16}/> Pedidos de Comida
        </button>
        <button 
          onClick={() => setActiveTab("reservations")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-amber-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}
        >
          <ClipboardList size={16}/> Reservas & Garantías
        </button>
      </div>

      {/* VISTA: PEDIDOS DE COMIDA */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
            <div key={order.id} className={`p-6 rounded-2xl border ${order.payment_status === 'pagado' ? 'bg-zinc-900/50 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Mesa {order.table_number}</h3>
                        <p className="text-xs text-zinc-500">Mozo/Cliente: {order.customer_name || order.waiter_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.payment_status === 'pagado' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                        {order.payment_status === 'pagado' ? 'PAGADO' : 'PENDIENTE'}
                    </span>
                </div>
                
                <div className="space-y-2 mb-6 border-y border-dashed border-zinc-800 py-4 my-4">
                    {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-zinc-300">
                            <span>1x {item.title}</span>
                            <span>S/ {item.price}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xl font-mono font-bold">S/ {order.total_price.toFixed(2)}</span>
                    {order.payment_status !== 'pagado' && (
                        <button 
                            onClick={() => confirmOrderPayment(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                        >
                            <DollarSign size={14}/> Cobrar
                        </button>
                    )}
                </div>
            </div>
            ))}
        </div>
      )}

      {/* VISTA: RESERVAS Y GARANTÍAS */}
      {activeTab === 'reservations' && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full text-left bg-zinc-900">
                <thead className="bg-black text-zinc-500 text-[10px] uppercase tracking-widest">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Fecha/Hora</th>
                        <th className="p-4">Personas</th>
                        <th className="p-4">Garantía</th>
                        <th className="p-4">Método</th>
                        <th className="p-4 text-center">Estado Pago</th>
                        <th className="p-4 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                    {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="p-4 font-bold text-white">
                                {res.name}<br/>
                                <span className="text-zinc-500 text-xs font-normal">{res.phone}</span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2"><Calendar size={14} className="text-amber-500"/> {res.date}</div>
                                <div className="flex items-center gap-2 mt-1 text-zinc-500"><Clock size={14}/> {res.time}</div>
                            </td>
                            <td className="p-4 flex items-center gap-2">
                                <Users size={14} className="text-zinc-500"/> {res.people}
                            </td>
                            <td className="p-4 font-mono text-amber-500 font-bold">
                                S/ {res.paid_amount ? res.paid_amount.toFixed(2) : "0.00"}
                            </td>
                            <td className="p-4 uppercase text-xs font-bold tracking-wider">
                                {res.payment_method === 'yape' && <span className="flex items-center gap-1 text-purple-400"><Smartphone size={14}/> Yape</span>}
                                {res.payment_method === 'tarjeta' && <span className="flex items-center gap-1 text-blue-400"><CreditCard size={14}/> Tarjeta</span>}
                                {res.payment_method === 'transferencia' && <span className="flex items-center gap-1 text-orange-400"><Banknote size={14}/> BCP</span>}
                            </td>
                            <td className="p-4 text-center">
                                {res.payment_status === 'pagado' || res.payment_status === 'paid' ? (
                                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20">
                                        Pagado
                                    </span>
                                ) : (
                                    <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-red-500/20 animate-pulse">
                                        Pendiente
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                {res.payment_status !== 'pagado' && res.payment_status !== 'paid' && (
                                    <button 
                                        onClick={() => confirmReservationPayment(res.id, res.payment_status)}
                                        className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-amber-900/20"
                                    >
                                        Verificar Abono
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {reservations.length === 0 && (
                        <tr>
                            <td colSpan="7" className="p-8 text-center text-zinc-500">No hay reservas registradas aún.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}