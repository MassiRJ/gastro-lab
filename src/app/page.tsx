"use client";

import { useState } from "react";
import { 
  ShoppingCart, Plus, Menu as MenuIcon, X, 
  Trash2, Send, MapPin, CreditCard, Smartphone, Banknote
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ==========================================
// 1. DATOS DE LA CARTA
// ==========================================
const ENTRADAS = [
  { id: 1, category: "Entradas", title: "Ceviche Clásico", price: 35.00, desc: "Pesca del día, leche de tigre y camote." },
  { id: 2, category: "Entradas", title: "Causa Limeña", price: 20.00, desc: "Papa amarilla, pollo deshilachado y palta." },
  { id: 3, category: "Entradas", title: "Papa a la Huancaína", price: 18.00, desc: "Salsa cremosa de ají amarillo y queso." },
  { id: 4, category: "Entradas", title: "Tequeños de Queso", price: 15.00, desc: "Con salsa de palta o huancaína." },
];
const FONDOS = [
  { id: 5, category: "Fondos", title: "Lomo Saltado", price: 45.00, desc: "Clásico peruano al wok con papas fritas." },
  { id: 6, category: "Fondos", title: "Ají de Gallina", price: 30.00, desc: "Cremoso guiso con nueces y arroz." },
  { id: 7, category: "Fondos", title: "Arroz con Mariscos", price: 42.00, desc: "Selección de mariscos y salsa madre." },
  { id: 8, category: "Fondos", title: "Seco de Cordero", price: 48.00, desc: "Macerado en chicha de jora y culantro." },
];
const BEBIDAS = [
  { id: 9, category: "Bebidas", title: "Chicha Morada (Jarra)", price: 15.00, desc: "Maíz morado, piña y canela." },
  { id: 10, category: "Bebidas", title: "Limonada Frozen", price: 12.00, desc: "Refrescante y clásica." },
  { id: 11, category: "Bebidas", title: "Pisco Sour", price: 25.00, desc: "Nuestro cóctel bandera." },
  { id: 12, category: "Bebidas", title: "Cerveza Cusqueña", price: 10.00, desc: "Trigo, Dorada o Negra." },
];

// ==========================================
// 2. COMPONENTES VISUALES (Restaurando Diseño)
// ==========================================

function InternalNavbar({ cartCount, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO EXACTO */}
          <div className="flex-shrink-0 font-bold text-2xl tracking-widest text-white cursor-pointer uppercase">
            GASTRO<span className="text-orange-500">•</span>LAB
          </div>

          {/* MENÚ CENTRAL */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest text-gray-300">
            <a href="#" className="hover:text-white transition-colors">INICIO</a>
            <a href="#menu" className="hover:text-white transition-colors">MENÚ</a>
            <a href="#" className="hover:text-white transition-colors">NOSOTROS</a>
            <a href="#" className="hover:text-white transition-colors">RESERVAS</a>
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
           <a href="#menu" className="block text-gray-300 hover:text-white py-2 text-sm font-bold tracking-widest">MENÚ</a>
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
      {/* FONDO OSCURO CON IMAGEN */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
        <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920&auto=format&fit=crop" 
            alt="Fondo Gourmet" 
            className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* TEXTO HERO RESTAURADO */}
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
            <button className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all w-full md:w-auto shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Reservar Mesa ➔
            </button>
            <a href="#menu" className="group bg-transparent border border-white/20 hover:border-white text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all w-full md:w-auto">
                Ver Menú Digital
            </a>
        </div>
      </div>
    </div>
  );
}

function InternalCartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const total = cartItems ? cartItems.reduce((sum, item) => sum + item.price, 0) : 0;
  
  // ESTADOS DEL FORMULARIO (CORREGIDOS)
  const [table, setTable] = useState("");
  const [payment, setPayment] = useState("efectivo");
  const [loading, setLoading] = useState(false);

  // Generamos mesas del 1 al 15
  const mesas = Array.from({length: 15}, (_, i) => i + 1);

  const handleSend = async () => {
      // VALIDACIÓN: Solo mesa requerida (Nombre eliminado)
      if(!table) { 
          alert("⚠️ Por favor selecciona tu número de Mesa."); 
          return; 
      }
      
      setLoading(true);
      try {
        const { error } = await supabase.from('orders').insert([
            {
              table_number: table,
              // customer_name: "Cliente", // Opcional: enviamos un valor por defecto o lo omitimos si la DB lo permite
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
          
          {/* HEADER CARRITO */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-orange-500">●</span> Tu Pedido
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"><X/></button>
          </div>
          
          {/* LISTA ITEMS */}
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

          {/* CHECKOUT SECTION (CORREGIDA) */}
          {cartItems && cartItems.length > 0 && (
              <div className="bg-zinc-900 p-5 rounded-2xl mb-4 space-y-5 border border-zinc-800 mt-4 shadow-xl">
                  
                  {/* SELECCIÓN DE MESA (Dropdown) */}
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

                  {/* MÉTODO DE PAGO (Botones) */}
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

          {/* FOOTER TOTAL */}
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
// 3. PÁGINA PRINCIPAL (MONOLITO)
// ==========================================

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Entradas");

  // Selección de items
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
      // USAMOS SPLICE MANUALMENTE (SIN FILTER)
      const index = newCart.findIndex(item => item.cartId === cartId);
      if (index > -1) newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  return (
    <main className="bg-black min-h-screen text-white selection:bg-orange-500 selection:text-white font-sans">
      <InternalNavbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
      <InternalHero />
      
      {/* SECCIÓN MENU */}
      <section id="menu" className="py-24 px-4 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight">Nuestra <span className="text-orange-500">Carta</span></h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"/>
        </div>
        
        {/* TABS CATEGORÍAS */}
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
        
        {/* GRILLA DE PLATOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsToShow.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/10">
                {/* IMAGEN PLATO */}
                <div className="h-56 bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"/>
                    <span className="text-9xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors duration-500 z-0 select-none transform group-hover:scale-110">
                        {item.title.charAt(0)}
                    </span>
                </div>

                {/* INFO */}
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

      {/* FOOTER SIMPLE */}
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