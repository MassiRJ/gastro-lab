"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { CheckCircle, Clock, ChefHat, Loader2, LogOut } from "lucide-react";

export default function KitchenView() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. EL CANDADO DE SEGURIDAD 🔒 ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // ¡Fuera de aquí!
      } else {
        setAuthorized(true);   // Pase usted
        fetchOrders();         // Cargar pedidos
      }
    };
    checkUser();
  }, []);

  // --- 2. SISTEMA DE TIEMPO REAL ⚡ ---
  useEffect(() => {
    if (!authorized) return;

    const channel = supabase
      .channel('cocina_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    // Actualizar cada 10 seg por si acaso
    const interval = setInterval(fetchOrders, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [authorized]);

  const fetchOrders = async () => {
    setLoading(true);
    // Traemos pedidos que NO estén completados (pendientes o pagados)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "completado") 
      .order("created_at", { ascending: true }); // Los más viejos primero (FIFO)
    
    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
    setLoading(false);
  };

  const markAsReady = async (id) => {
    const confirm = window.confirm("¿Pedido listo para entregar?");
    if (!confirm) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "completado" })
      .eq("id", id);

    if (error) alert("Error al actualizar");
    else fetchOrders();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // PANTALLA DE CARGA (MIENTRAS VERIFICA PERMISO)
  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      
      {/* HEADER COCINA */}
      <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
        <div>
            <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
                <ChefHat className="text-orange-500" size={32}/> Cocina
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Gestión de Comandas en Vivo</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="bg-orange-900/30 px-4 py-2 rounded-lg border border-orange-500/30 text-orange-400 font-bold">
                {orders.length} Pendientes
            </div>
            <button 
                onClick={handleLogout}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white p-3 rounded-lg transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut size={20}/>
            </button>
        </div>
      </header>

      {/* GRILLA DE PEDIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-600 opacity-50">
                <ChefHat size={64} className="mb-4"/>
                <p className="text-xl font-bold uppercase tracking-widest">Todo limpio, Chef</p>
            </div>
        ) : (
            orders.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-lg animate-in fade-in zoom-in duration-300 relative group">
                    
                    {/* Borde Superior de Estado */}
                    <div className={`h-2 w-full ${order.payment_status === 'pagado' ? 'bg-emerald-500' : 'bg-orange-500'}`}/>

                    <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-black text-white">Mesa {order.table_number}</h2>
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                                {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2 last:border-0">
                                    <span className="font-bold text-zinc-200">1x {item.title}</span>
                                </div>
                            ))}
                        </div>
                        
                        {order.waiter_name && (
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-4">
                                Mozo: {order.waiter_name}
                            </p>
                        )}
                    </div>

                    {/* Footer con Botón */}
                    <div className="p-4 bg-black/20 border-t border-zinc-800">
                        <button 
                            onClick={() => markAsReady(order.id)}
                            className="w-full bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 group-hover:bg-zinc-700"
                        >
                            <CheckCircle size={18}/> MARCAR LISTO
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}