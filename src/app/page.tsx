"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingCart, Plus, Menu as MenuIcon, X, 
  Trash2, Send, MapPin, Banknote, Smartphone,
  Calendar, Users, Clock, ChefHat, Star, ChevronDown, Phone,
  CreditCard, ShieldCheck, Copy, QrCode, Loader2, ArrowRight
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ==========================================
// 1. DATOS DE RESPALDO (FALLBACK)
// ==========================================
const ENTRADAS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00, desc: "Pesca del día, leche de tigre y camote glaseado." },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00, desc: "Papa amarilla prensada, pollo deshilachado y palta fuerte." },
];
const FONDOS = [
  { id: 3, category: "Fondos", title: "Lomo Saltado", price: 45.00, desc: "Trozos de lomo fino al wok con cebolla, tomate y papas fritas." },
  { id: 4, category: "Fondos", title: "Ají de Gallina", price: 30.00, desc: "Cremoso guiso de ají amarillo con pechuga deshilachada." },
];
const BEBIDAS = [
  { id: 5, category: "Bebidas", title: "Chicha Morada", price: 15.00, desc: "Maíz morado, piña, canela y clavo de olor." },
  { id: 6, category: "Bebidas", title: "Pisco Sour", price: 25.00, desc: "Nuestro cóctel bandera con Pisco Quebranta." },
];

// ==========================================
// 2. COMPONENTES VISUALES
// ==========================================

function InternalNavbar({ cartCount, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <>
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            
            {/* LOGO */}
            <div className="flex-shrink-0 font-bold text-2xl tracking-widest text-white cursor-pointer uppercase z-50">
              GASTRO<span className="text-amber-500">.</span>LAB
            </div>

            {/* MENÚ DE ESCRITORIO (Visible solo en PC) */}
            <div className="hidden md:flex items-center space-x-10 text-xs font-bold tracking-widest text-gray-400">
              <a href="#" className="hover:text-amber-500 transition-colors">INICIO</a>
              <a href="#nosotros" className="hover:text-amber-500 transition-colors">NOSOTROS</a>
              <a href="#menu" className="hover:text-amber-500 transition-colors">MENÚ</a>
              <a href="#reservas" className="hover:text-amber-500 transition-colors">RESERVAS</a>
            </div>

            {/* BOTONES DERECHA (Carrito y CTA) */}
            <div className="hidden md:flex items-center gap-6">
               <button onClick={onOpenCart} className="relative p-2 text-white hover:text-amber-500 transition-colors group">
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform"/>
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">{cartCount}</span>}
               </button>
               <button className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-none border border-white font-bold text-xs tracking-widest transition-all hover:scale-105">
                  PEDIR ONLINE
               </button>
            </div>

            {/* BOTÓN HAMBURGUESA (MÓVIL) */}
            <div className="flex md:hidden z-50">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 focus:outline-none">
                {isOpen ? <X size={32} className="text-amber-500"/> : <MenuIcon size={32}/>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MENÚ MÓVIL FULL SCREEN (DISEÑO MEJORADO) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[45] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden animate-in slide-in-from-top-10 fade-in duration-300">
           
           {/* Enlaces de Navegación */}
           <div className="flex flex-col gap-8 text-center mb-12">
             {['INICIO', 'NOSOTROS', 'MENÚ', 'RESERVAS'].map((item) => (
               <a 
                 key={item}
                 href={`#${item === 'INICIO' ? '' : item.toLowerCase()}`}
                 onClick={() => setIsOpen(false)}
                 className="text-3xl font-light text-white tracking-[0.2em] hover:text-amber-500 transition-all hover:scale-110 active:scale-95"
               >
                 {item}
               </a>
             ))}
           </div>

           {/* Línea divisoria decorativa */}
           <div className="w-16 h-[1px] bg-zinc-800 mb-10"></div>

           {/* Acciones Móviles */}
           <div className="flex flex-col gap-6 w-full max-w-xs px-6">
             <button 
                onClick={() => { setIsOpen(false); onOpenCart(); }} 
                className="w-full bg-zinc-900 border border-zinc-800 text-white py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold tracking-widest hover:border-amber-500 transition-all"
             >
                <ShoppingCart size={18} className="text-amber-500"/>
                VER CARRITO ({cartCount})
             </button>
             
             <button className="w-full bg-amber-500 text-black py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                PEDIR AHORA <ArrowRight size={18}/>
             </button>
           </div>

           {/* Footer del menú */}
           <div className="absolute bottom-10 text-zinc-600 text-[10px] tracking-[0.3em] uppercase">
              © 2025 GastroLab Mobile
           </div>
        </div>
      )}
    </>
  );
}

function InternalHero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* FONDO DE VIDEO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black z-10" />
        <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50"
        >
            <source src="/video.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
        </video>
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
        <div className="inline-block border border-amber-500/50 px-6 py-2 rounded-full mb-8 backdrop-blur-sm animate-in fade-in zoom-in duration-1000">
            <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Alta Cocina &bull; Lima 2025</span>
        </div>
        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-white leading-none animate-in slide-in-from-bottom-10 duration-1000">
          SABOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">PURO</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-10 duration-1000 delay-200">
          Fusionamos la tradición culinaria con la innovación digital.<br className="hidden md:block"/>
          Una experiencia que despierta todos tus sentidos.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom-10 duration-1000 delay-300">
            <a href="#reservas" className="bg-amber-500 hover:bg-amber-400 text-black px-10 py-4 font-bold text-sm tracking-widest transition-all w-full md:w-auto hover:scale-105 shadow-lg shadow-amber-500/20">
                RESERVAR MESA
            </a>
            <a href="#menu" className="bg-transparent border border-white/30 hover:border-white text-white px-10 py-4 font-bold text-sm tracking-widest transition-all w-full md:w-auto hover:bg-white/5">
                VER CARTA
            </a>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
        <ChevronDown size={32}/>
      </div>
    </div>
  );
}

function InternalAbout() {
  return (
    <section id="nosotros" className="py-32 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="order-2 md:order-1">
          <h3 className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4">Nuestra Filosofía</h3>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            Más que cocina, <br/>es <span className="text-zinc-600">Arte.</span>
          </h2>
          <p className="text-gray-400 leading-loose mb-6 text-sm md:text-base">
            En GastroLab, cada plato es una obra maestra diseñada para contar una historia. 
            Utilizamos ingredientes locales de primera calidad y aplicamos técnicas modernas 
            para resaltar los sabores auténticos de nuestra tierra.
          </p>
          <div className="grid grid-cols-2 gap-10 border-t border-zinc-900 pt-10 mt-10">
            <div><div className="flex items-center gap-3 mb-3 text-white font-bold"><ChefHat className="text-amber-500"/> Maestría</div><p className="text-xs text-gray-500 uppercase tracking-wider">Chefs Galardonados</p></div>
            <div><div className="flex items-center gap-3 mb-3 text-white font-bold"><Star className="text-amber-500"/> Excelencia</div><p className="text-xs text-gray-500 uppercase tracking-wider">Productos A1</p></div>
          </div>
        </div>
        <div className="order-1 md:order-2 relative">
           <div className="absolute -inset-4 bg-amber-500/10 rounded-none blur-3xl"></div>
           <div className="relative h-[600px] w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
             <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop" alt="Chef cocinando" className="w-full h-full object-cover"/>
           </div>
        </div>
      </div>
    </section>
  );
}

function InternalReservation() {
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", time: "", people: "2", paymentMethod: "yape" });
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "", owner: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "tarjeta") {
        if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.owner) {
            alert("⚠️ Por favor completa los datos de la tarjeta."); return;
        }
    }
    setLoading(true);
    try {
        if (formData.paymentMethod === "tarjeta") await new Promise(resolve => setTimeout(resolve, 2000));
        const { error } = await supabase.from('reservations').insert([{
            name: formData.name, phone: formData.phone, date: formData.date, time: formData.time, people: formData.people,
            status: formData.paymentMethod === 'tarjeta' ? 'confirmada' : 'pendiente de pago',
            payment_status: formData.paymentMethod === 'tarjeta' ? 'pagado' : 'pending',
            payment_method: formData.paymentMethod, paid_amount: 50
        }]);
        if (error) throw error;
        if (formData.paymentMethod === 'tarjeta') alert(`✅ ¡Pago Exitoso! Tu reserva ha sido CONFIRMADA automáticamente.`);
        else alert(`📩 Solicitud enviada. Por favor envía la captura de tu Yape al WhatsApp para confirmar.`);
        setFormData({ name: "", phone: "", date: "", time: "", people: "2", paymentMethod: "yape" });
        setCardData({ number: "", expiry: "", cvc: "", owner: "" });
    } catch (error) { console.error(error); alert("Error al reservar: " + error.message); } finally { setLoading(false); }
  };

  return (
    <section id="reservas" className="py-32 bg-black relative border-t border-zinc-900">
       <div className="max-w-6xl mx-auto px-6 relative z-10">
         <div className="text-center mb-16">
             <h3 className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4">Agenda tu Visita</h3>
             <h2 className="text-4xl md:text-5xl font-black text-white">Reserva tu Mesa</h2>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-xl">
               <h3 className="text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Users className="text-amber-500" size={18}/> Datos de Reserva</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase">Nombre Completo</label><input required type="text" placeholder="Ej. Juan Pérez" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                 <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase">Celular</label><input required type="tel" placeholder="999 999 999" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none rounded-lg" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                 <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase">Fecha</label><input required type="date" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none rounded-lg [&::-webkit-calendar-picker-indicator]:invert" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} /></div>
                 <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase">Hora</label><input required type="time" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none rounded-lg [&::-webkit-calendar-picker-indicator]:invert" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} /></div>
                 <div className="space-y-2 md:col-span-2"><label className="text-[10px] font-bold text-zinc-500 uppercase">Personas</label><select className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none rounded-lg" value={formData.people} onChange={(e) => setFormData({...formData, people: e.target.value})}>{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Personas</option>)}<option value="more">+10 Personas</option></select></div>
               </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl h-fit">
               <h3 className="text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck className="text-amber-500" size={18}/> Garantía: S/ 50.00</h3>
               <div className="flex gap-2 mb-6">
                   <button onClick={() => setFormData({...formData, paymentMethod: "yape"})} className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase border transition-all ${formData.paymentMethod === "yape" ? "bg-purple-600 border-purple-600 text-white" : "bg-black border-zinc-800 text-zinc-500 hover:text-white"}`}>Yape / Plin</button>
                   <button onClick={() => setFormData({...formData, paymentMethod: "tarjeta"})} className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase border transition-all ${formData.paymentMethod === "tarjeta" ? "bg-amber-500 border-amber-500 text-black" : "bg-black border-zinc-800 text-zinc-500 hover:text-white"}`}>Tarjeta</button>
               </div>
               {formData.paymentMethod === "yape" ? (
                   <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                       <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl text-center mb-6">
                           <div className="bg-white w-32 h-32 mx-auto mb-4 rounded-lg flex items-center justify-center"><QrCode className="text-black" size={80}/></div>
                           <p className="text-purple-300 text-xs uppercase font-bold mb-1">Yapear a nombre de GastroLab</p>
                           <p className="text-2xl font-black text-white tracking-widest">987 654 321</p>
                       </div>
                       <button onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl text-sm tracking-widest uppercase transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50">{loading ? "Procesando..." : "YA HICE EL PAGO"}</button>
                   </div>
               ) : (
                   <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                       <input type="text" placeholder="Número de Tarjeta" className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white text-sm outline-none focus:border-amber-500" value={cardData.number} onChange={e=>setCardData({...cardData, number: e.target.value})} maxLength={19}/>
                       <div className="flex gap-3">
                           <input type="text" placeholder="MM/YY" className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white text-sm outline-none focus:border-amber-500" value={cardData.expiry} onChange={e=>setCardData({...cardData, expiry: e.target.value})} maxLength={5}/>
                           <input type="text" placeholder="CVC" className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white text-sm outline-none focus:border-amber-500" value={cardData.cvc} onChange={e=>setCardData({...cardData, cvc: e.target.value})} maxLength={3}/>
                       </div>
                       <input type="text" placeholder="Nombre del Titular" className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white text-sm outline-none focus:border-amber-500" value={cardData.owner} onChange={e=>setCardData({...cardData, owner: e.target.value})}/>
                       <button onClick={handleSubmit} disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl text-sm tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 flex justify-center items-center gap-2">{loading ? <><Loader2 className="animate-spin" size={18}/> PROCESANDO PAGO...</> : "PAGAR S/ 50.00"}</button>
                   </div>
               )}
            </div>
         </div>
       </div>
    </section>
  );
}

function InternalCartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const total = cartItems ? cartItems.reduce((sum, item) => sum + item.price, 0) : 0;
  const [table, setTable] = useState("");
  const [payment, setPayment] = useState("efectivo");
  const [loading, setLoading] = useState(false);
  const mesas = Array.from({length: 15}, (_, i) => i + 1);

  const handleSend = async () => {
      if(!table) { alert("⚠️ Por favor selecciona tu número de Mesa."); return; }
      setLoading(true);
      try {
        const { error } = await supabase.from('orders').insert([{
              table_number: table,
              items: cartItems,
              total_price: total,
              status: 'pendiente',
              created_at: new Date(),
              payment_method: payment
        }]);
        if (error) throw error;
        alert(`✅ Pedido Enviado\nMesa: ${table}\nTotal: S/ ${total.toFixed(2)}`);
        onClearCart();
        onClose();
        setTable("");
      } catch (e) { console.error(e); alert("Error al enviar: " + e.message); } finally { setLoading(false); }
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] animate-in fade-in duration-300" />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[70] transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900">
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">Tu Pedido</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white"><X/></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {!cartItems || cartItems.length === 0 ? (<div className="h-full flex flex-col items-center justify-center opacity-30 text-zinc-600"><ShoppingCart size={48} className="mb-4"/><p className="uppercase tracking-widest text-sm">Carrito vacío</p></div>) : (
              cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between items-center bg-black p-4 border border-zinc-900">
                  <div><h4 className="font-bold text-white text-sm">{item.title}</h4><p className="text-amber-500 font-mono text-xs mt-1">S/ {item.price.toFixed(2)}</p></div>
                  <button onClick={() => onRemoveItem(item.cartId)} className="text-zinc-600 hover:text-red-500 p-2 transition-all"><Trash2 size={16}/></button>
                </div>
              ))
            )}
          </div>
          {cartItems && cartItems.length > 0 && (
              <div className="bg-black p-6 mb-6 space-y-6 border border-zinc-900 mt-6">
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Seleccionar Mesa</label><div className="relative"><MapPin className="absolute left-4 top-4 text-amber-500" size={16}/><select className="w-full bg-zinc-900 border border-zinc-800 p-3 pl-12 text-white appearance-none focus:border-amber-500 outline-none cursor-pointer font-bold text-sm" value={table} onChange={e => setTable(e.target.value)}><option value="">-- Elige Mesa --</option>{mesas.map(m => (<option key={m} value={m}>Mesa {m}</option>))}</select></div></div>
                  <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Pago</label><div className="grid grid-cols-2 gap-3"><button onClick={() => setPayment("efectivo")} className={`p-3 border flex flex-col items-center gap-2 transition-all ${payment === "efectivo" ? "bg-amber-500 text-black border-amber-500" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"}`}><Banknote size={18}/><span className="text-[10px] font-bold uppercase tracking-wider">Efectivo</span></button><button onClick={() => setPayment("yape")} className={`p-3 border flex flex-col items-center gap-2 transition-all ${payment === "yape" ? "bg-purple-600 text-white border-purple-600" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"}`}><Smartphone size={18}/><span className="text-[10px] font-bold uppercase tracking-wider">Yape / Plin</span></button></div></div>
              </div>
          )}
          <div className="border-t border-zinc-900 pt-6">
            <div className="flex justify-between text-xl font-bold mb-6 text-white"><span className="text-sm uppercase tracking-widest text-zinc-500">Total a Pagar</span><span className="text-amber-500 font-mono text-2xl">S/ {total.toFixed(2)}</span></div>
            <button onClick={handleSend} disabled={loading || cartItems.length === 0} className="w-full bg-white hover:bg-gray-200 text-black py-4 font-bold flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 text-sm tracking-widest uppercase">{loading ? "Enviando..." : <>Confirmar Pedido <Send size={16}/></>}</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// 3. PÁGINA PRINCIPAL (CARGA DINÁMICA)
// ==========================================

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Entradas");
  
  // MENU DINAMICO
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data } = await supabase.from('menu_items').select('*').eq('available', true);
      if (data && data.length > 0) {
        setMenuItems(data);
      } else {
        // Fallback si la DB está vacía
        setMenuItems([...ENTRADAS, ...FONDOS, ...BEBIDAS]);
      }
      setLoadingMenu(false);
    };
    fetchMenu();
  }, []);

  // FILTRAR CATEGORÍA
  const itemsToShow = menuItems.filter(item => item.category === activeCategory);

  const addToCart = (item) => {
    setCart((prev) => {
        const current = prev || [];
        return [...current, { ...item, cartId: Math.random() }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => {
      if (!prev) return [];
      const newCart = [...prev];
      const index = newCart.findIndex(item => item.cartId === cartId);
      if (index > -1) newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-amber-500 selection:text-black font-sans scroll-smooth">
      <InternalNavbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <InternalHero />
      <InternalAbout />

      {/* SECCIÓN MENU */}
      <section id="menu" className="py-32 px-4 max-w-7xl mx-auto min-h-screen bg-black relative">
        <div className="text-center mb-20">
            <h3 className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-4">Nuestra Propuesta</h3>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight">Carta <span className="text-zinc-700">Digital</span></h2>
        </div>
        
        <div className="flex justify-center gap-6 mb-20 flex-wrap">
            {["Entradas", "Fondos", "Bebidas"].map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-4 border font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ${activeCategory === cat ? "bg-white text-black border-white" : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-white"}`}>{cat}</button>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loadingMenu ? (
                <div className="col-span-full text-center py-20"><Loader2 className="animate-spin text-amber-500 mx-auto" size={48}/></div>
            ) : itemsToShow.length === 0 ? (
                <div className="col-span-full text-center py-10 text-zinc-500">No hay platos disponibles en esta categoría.</div>
            ) : (
                itemsToShow.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                    
                    {/* IMAGEN DEL PLATO */}
                    <div className="h-64 bg-zinc-900 relative overflow-hidden mb-6 rounded-2xl border border-zinc-800">
                        {item.image_url ? (
                            <>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"/>
                                <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                <span className="text-9xl font-black text-zinc-700 select-none opacity-50">{item.title.charAt(0)}</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"/>
                            </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700 z-20">
                             <span className="text-amber-500 font-mono font-bold">S/ {item.price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="relative px-2">
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider group-hover:text-amber-500 transition-colors">{item.title}</h3>
                        </div>
                        <p className="text-zinc-500 text-sm mb-6 leading-relaxed min-h-[40px] line-clamp-2">{item.desc || "Plato especial de la casa."}</p>
                        <button onClick={() => addToCart(item)} className="w-full border border-zinc-800 hover:bg-white hover:text-black hover:border-white text-white py-4 font-bold flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-[0.2em] rounded-xl"><Plus size={16} /> Agregar al Pedido</button>
                    </div>
                </div>
                ))
            )}
        </div>
      </section>

      <InternalReservation />

      <footer className="py-12 text-center border-t border-zinc-900 bg-black text-zinc-700 text-[10px] uppercase tracking-[0.3em]">
        © 2025 GastroLab. All Rights Reserved.
      </footer>
      
      <InternalCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onRemoveItem={removeFromCart} onClearCart={clearCart} />
    </main>
  );
}