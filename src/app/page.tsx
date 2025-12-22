"use client";

import { useState } from "react";
import { 
  ShoppingCart, Plus, Menu as MenuIcon, X, 
  Trash2, Send, MapPin, Banknote, Smartphone,
  Calendar, Users, Clock, ChefHat, Star
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ==========================================
// 1. DATOS DE LA CARTA
// ==========================================
const ENTRADAS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00, desc: "Pesca del día, leche de tigre y camote glaseado." },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00, desc: "Papa amarilla prensada, pollo deshilachado y palta fuerte." },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00, desc: "Salsa cremosa de ají amarillo sobre papas nativas." },
  { id: 4, category: "Entradas", title: "Tequeños de Queso", price: 15.00, desc: "Masa crocante rellena de queso andino con guacamole." },
];
const FONDOS = [
  { id: 5, category: "Fondos", title: "Lomo Saltado", price: 45.00, desc: "Trozos de lomo fino al wok con cebolla, tomate y papas fritas." },
  { id: 6, category: "Fondos", title: "Ají de Gallina", price: 30.00, desc: "Cremoso guiso de ají amarillo con pechuga deshilachada." },
  { id: 7, category: "Fondos", title: "Arroz con Mariscos", price: 42.00, desc: "Arroz arbóreo con selección de mariscos y salsa madre." },
  { id: 8, category: "Fondos", title: "Seco de Cordero", price: 48.00, desc: "Macerado 24 horas en chicha de jora y culantro." },
];
const BEBIDAS = [
  { id: 9, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00, desc: "Maíz morado, piña, canela y clavo de olor." },
  { id: 10, category: "Bebidas", title: "Limonada Frozen", price: 12.00, desc: "Refrescante, con hierba luisa y menta." },
  { id: 11, category: "Bebidas", title: "Pisco Sour", price: 25.00, desc: "Nuestro cóctel bandera con Pisco Quebranta." },
  { id: 12, category: "Bebidas", title: "Cerveza Cusqueña", price: 10.00, desc: "Trigo, Dorada o Negra bien helada." },
];

// ==========================================
// 2. COMPONENTES VISUALES
// ==========================================

function InternalNavbar({ cartCount, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0 font-bold text-2xl tracking-widest text-white cursor-pointer uppercase">
            GASTRO<span className="text-orange-500">•</span>LAB
          </div>

          {/* MENÚ CENTRAL */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest text-gray-300">
            <a href="#" className="hover:text-white transition-colors">INICIO</a>
            <a href="#nosotros" className="hover:text-white transition-colors">NOSOTROS</a>
            <a href="#menu" className="hover:text-white transition-colors">MENÚ</a>
            <a href="#reservas" className="hover:text-white transition-colors">RESERVAS</a>
          </div>

          {/* BOTONES DERECHA */}
          <div className="hidden md:flex items-center gap-4">
             <button onClick={onOpenCart} className="relative p-2 text-white hover:text-orange-500 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
             </button>
             <button className="bg-orange-500 hover:bg-orange-400 text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-orange-500/20">
                Pedir Online
             </button>
          </div>

          {/* MENU MOVIL */}
          <div className="flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-zinc-950 px-4 pt-2 pb-4 space-y-2 border-b border-zinc-800 absolute w-full">
           <a href="#nosotros" className="block text-gray-300 hover:text-white py-2 text-sm font-bold tracking-widest">NOSOTROS</a>
           <a href="#menu" className="block text-gray-300 hover:text-white py-2 text-sm font-bold tracking-widest">MENÚ</a>
           <a href="#reservas" className="block text-gray-300 hover:text-white py-2 text-sm font-bold tracking-widest">RESERVAS</a>
           <button onClick={onOpenCart} className="w-full text-left text-orange-500 font-bold block py-2 text-sm">
             VER CARRITO ({cartCount})
           </button>
        </div>
      )}
    </nav>
  );
}

function InternalHero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
        <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920&auto=format&fit=crop" 
            alt="Fondo Gourmet" 
            className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-10">
        <div className="inline-block border border-orange-500/30 bg-orange-500/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
            <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">✨ Experiencia Gastronómica 2025</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white leading-none">
          SABOR <span className="text-orange-500">ABSOLUTO</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          Donde la tradición culinaria se encuentra con la innovación digital.<br className="hidden md:block"/>
          Reserva tu mesa en el futuro de la gastronomía.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#reservas" className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all w-full md:w-auto shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Reservar Mesa ➔
            </a>
            <a href="#menu" className="group bg-transparent border border-white/20 hover:border-white text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all w-full md:w-auto">
                Ver Menú Digital
            </a>
        </div>
      </div>
    </div>
  );
}

// --- NUEVA SECCIÓN NOSOTROS ---
function InternalAbout() {
  return (
    <section id="nosotros" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* TEXTO */}
        <div className="order-2 md:order-1">
          <h3 className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2">Nuestra Historia</h3>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Pasión por el <br/><span className="text-zinc-500">Detalle.</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            En GastroLab, fusionamos la riqueza de la cocina tradicional peruana con técnicas de vanguardia. 
            Cada plato cuenta una historia, desde la selección matutina de ingredientes frescos hasta el emplatado final en tu mesa.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            No somos solo un restaurante; somos un laboratorio de sabores donde la tecnología 
            mejora tu experiencia sin perder la calidez del servicio humano.
          </p>
          
          <div className="grid grid-cols-2 gap-8 border-t border-zinc-800 pt-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-white font-bold"><ChefHat className="text-orange-500"/> Chefs Expertos</div>
              <p className="text-xs text-gray-500">Maestros con trayectoria internacional.</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-white font-bold"><Star className="text-orange-500"/> Calidad Premium</div>
              <p className="text-xs text-gray-500">Insumos seleccionados diariamente.</p>
            </div>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="order-1 md:order-2 relative">
           <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl"></div>
           <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop" 
               alt="Chef cocinando" 
               className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           </div>
        </div>
      </div>
    </section>
  );
}

// --- NUEVA SECCIÓN RESERVAS ---
function InternalReservation() {
  const [formData, setFormData] = useState({ name: "", date: "", time: "", guests: "2" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`📅 ¡Reserva Solicitada!\n\nNombre: ${formData.name}\nFecha: ${formData.date} a las ${formData.time}\nPersonas: ${formData.guests}\n\nTe confirmaremos por correo en breve.`);
    setFormData({ name: "", date: "", time: "", guests: "2" });
  };

  return (
    <section id="reservas" className="py-24 bg-black relative">
       {/* Decoración de fondo */}
       <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-900/30 skew-x-12 pointer-events-none"></div>

       <div className="max-w-5xl mx-auto px-6 relative z-10">
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
           <div className="text-center mb-10">
             <h3 className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2">Reserva tu Mesa</h3>
             <h2 className="text-3xl md:text-4xl font-black text-white">Vive la Experiencia</h2>
           </div>

           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Nombre */}
             <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Nombre Completo</label>
               <input 
                 required
                 type="text" 
                 placeholder="Ej. Juan Pérez"
                 className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
             </div>

             {/* Personas */}
             <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase ml-1">N° Personas</label>
               <div className="relative">
                 <Users className="absolute left-4 top-4 text-zinc-500" size={20}/>
                 <select 
                   className="w-full bg-black border border-zinc-800 rounded-xl p-4 pl-12 text-white focus:border-orange-500 outline-none appearance-none cursor-pointer"
                   value={formData.guests}
                   onChange={(e) => setFormData({...formData, guests: e.target.value})}
                 >
                   {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Personas</option>)}
                   <option value="more">+8 Personas</option>
                 </select>
               </div>
             </div>

             {/* Fecha */}
             <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Fecha</label>
               <div className="relative">
                 <Calendar className="absolute left-4 top-4 text-zinc-500" size={20}/>
                 <input 
                   required
                   type="date" 
                   className="w-full bg-black border border-zinc-800 rounded-xl p-4 pl-12 text-white focus:border-orange-500 outline-none appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                   value={formData.date}
                   onChange={(e) => setFormData({...formData, date: e.target.value})}
                 />
               </div>
             </div>

             {/* Hora */}
             <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Hora</label>
               <div className="relative">
                 <Clock className="absolute left-4 top-4 text-zinc-500" size={20}/>
                 <input 
                   required
                   type="time" 
                   className="w-full bg-black border border-zinc-800 rounded-xl p-4 pl-12 text-white focus:border-orange-500 outline-none appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                   value={formData.time}
                   onChange={(e) => setFormData({...formData, time: e.target.value})}
                 />
               </div>
             </div>

             {/* Botón Submit */}
             <div className="md:col-span-2 mt-4">
               <button className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-4 rounded-xl text-lg transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                 CONFIRMAR RESERVA
               </button>
             </div>
           </form>
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
      if(!table) { 
          alert("⚠️ Por favor selecciona tu número de Mesa."); 
          return; 
      }
      
      setLoading(true);
      try {
        const { error } = await supabase.from('orders').insert([
            {
              table_number: table,
              items: cartItems,
              total_price: total,
              status: 'pendiente',
              created_at: new Date(),
              payment_method: payment
            }
        ]);

        if (error) throw error;

        alert(`✅ Pedido Confirmado\nMesa: ${table}\nPago: ${payment.toUpperCase()}`);
        onClearCart();
        onClose();
        setTable("");
      } catch (e) {
        console.error(e);
        alert("Error al enviar: " + e.message);
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-in fade-in duration-300" />}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[70] transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-orange-500">●</span> Tu Pedido
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"><X/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {!cartItems || cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-zinc-500">
                    <ShoppingCart size={48} className="mb-4"/>
                    <p>Carrito vacío</p>
                </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartId} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-orange-500 font-mono text-xs mt-1">S/ {item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => onRemoveItem(item.cartId)} className="text-zinc-600 hover:text-red-500 p-2 transition-all">
                      <Trash2 size={16}/>
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems && cartItems.length > 0 && (
              <div className="bg-zinc-900 p-5 rounded-2xl mb-4 space-y-5 border border-zinc-800 mt-4 shadow-xl">
                  
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Seleccionar Mesa</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-orange-500" size={16}/>
                        <select 
                            className="w-full bg-black border border-zinc-700 p-3 pl-10 rounded-lg text-white appearance-none focus:border-orange-500 outline-none cursor-pointer font-bold"
                            value={table}
                            onChange={e => setTable(e.target.value)}
                        >
                            <option value="">-- Elige tu mesa --</option>
                            {mesas.map(m => (
                                <option key={m} value={m}>Mesa {m}</option>
                            ))}
                        </select>
                     </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Método de Pago</label>
                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setPayment("efectivo")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${payment === "efectivo" ? "bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-900/20" : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-600"}`}
                          >
                             <Banknote size={20}/>
                             <span className="text-xs font-bold">Efectivo</span>
                          </button>
                          
                          <button 
                            onClick={() => setPayment("yape")}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${payment === "yape" ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-900/20" : "bg-black text-zinc-400 border-zinc-800 hover:border-zinc-600"}`}
                          >
                             <Smartphone size={20}/>
                             <span className="text-xs font-bold">Yape / Plin</span>
                          </button>
                      </div>
                  </div>
              </div>
          )}

          <div className="border-t border-zinc-800 pt-6">
            <div className="flex justify-between text-xl font-bold mb-6 text-white">
                <span>Total</span>
                <span className="text-orange-500 font-mono text-2xl">S/ {total.toFixed(2)}</span>
            </div>
            <button 
                onClick={handleSend} 
                disabled={loading || cartItems.length === 0} 
                className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold flex justify-center gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 tracking-wide"
            >
                {loading ? "Enviando..." : <>CONFIRMAR PEDIDO <Send size={18}/></>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// 3. PÁGINA PRINCIPAL (ESTRUCTURA FINAL)
// ==========================================

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Entradas");

  let itemsToShow = [];
  if (activeCategory === "Entradas") itemsToShow = ENTRADAS;
  else if (activeCategory === "Fondos") itemsToShow = FONDOS;
  else itemsToShow = BEBIDAS;

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
    <main className="bg-black min-h-screen text-white selection:bg-orange-500 selection:text-white font-sans scroll-smooth">
      <InternalNavbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      
      {/* 1. HERO (INICIO) */}
      <InternalHero />
      
      {/* 2. NOSOTROS */}
      <InternalAbout />

      {/* 3. MENÚ */}
      <section id="menu" className="py-24 px-4 max-w-7xl mx-auto min-h-screen border-t border-zinc-900">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight">Nuestra <span className="text-orange-500">Carta</span></h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"/>
        </div>
        
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
            {["Entradas", "Fondos", "Bebidas"].map((cat) => (
            <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all transform hover:scale-105 ${
                    activeCategory === cat 
                    ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" 
                    : "bg-zinc-900 text-gray-400 border border-zinc-800 hover:border-orange-500/50 hover:text-white"
                }`}
            >
                {cat}
            </button>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToShow.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/10">
                <div className="h-56 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"/>
                    <span className="text-9xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors duration-500 z-0 select-none transform group-hover:scale-110">
                        {item.title.charAt(0)}
                    </span>
                </div>
                <div className="p-6 relative -mt-12 z-20">
                    <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                         <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded ml-2">S/ {item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{item.desc}</p>
                    <button 
                        onClick={() => addToCart(item)} 
                        className="w-full bg-white text-black hover:bg-orange-500 hover:text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm uppercase tracking-wide"
                    >
                        <Plus size={18} /> Agregar
                    </button>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* 4. RESERVAS */}
      <InternalReservation />

      {/* FOOTER */}
      <footer className="py-8 text-center border-t border-zinc-900 bg-black text-zinc-600 text-xs uppercase tracking-widest">
        © 2025 GastroLab. Todos los derechos reservados.
      </footer>
      
      <InternalCartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={removeFromCart}
        onClearCart={clearCart} 
      />
    </main>
  );
}