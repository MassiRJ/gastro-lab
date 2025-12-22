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

            {/* MENÚ DE ESCRITORIO */}
            <div className="hidden md:flex items-center space-x-10 text-xs font-bold tracking-widest text-gray-400">
              <a href="#" className="hover:text-amber-500 transition-colors">INICIO</a>
              <a href="#nosotros" className="hover:text-amber-500 transition-colors">NOSOTROS</a>
              <a href="#menu" className="hover:text-amber-500 transition-colors">MENÚ</a>
              <a href="#reservas" className="hover:text-amber-500 transition-colors">RESERVAS</a>
            </div>

            {/* BOTONES DERECHA */}
            <div className="hidden md:flex items-center gap-6">
               <button onClick={onOpenCart} className="relative p-2 text-white hover:text-amber-500 transition-colors group">
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform"/>
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">{cartCount}</span>}
               </button>
               
               {/* --- AQUÍ ESTÁ EL CAMBIO: AHORA ES UN ENLACE AL MENÚ --- */}
               <a 
                 href="#menu" 
                 className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-none border border-white font-bold text-xs tracking-widest transition-all hover:scale-105 flex items-center justify-center"
               >
                  PEDIR ONLINE
               </a>
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

      {/* MENÚ MÓVIL FULL SCREEN */}
      {isOpen && (
        <div className="fixed inset-0 z-[45] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden animate-in slide-in-from-top-10 fade-in duration-300">
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

           <div className="w-16 h-[1px] bg-zinc-800 mb-10"></div>

           <div className="flex flex-col gap-6 w-full max-w-xs px-6">
             <button 
                onClick={() => { setIsOpen(false); onOpenCart(); }} 
                className="w-full bg-zinc-900 border border-zinc-800 text-white py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold tracking-widest hover:border-amber-500 transition-all"
             >
                <ShoppingCart size={18} className="text-amber-500"/>
                VER CARRITO ({cartCount})
             </button>
             
             {/* --- TAMBIÉN ACTUALIZADO EN EL MENÚ MÓVIL --- */}
             <a 
                href="#menu"
                onClick={() => setIsOpen(false)}
                className="w-full bg-amber-500 text-black py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
             >
                PEDIR AHORA <ArrowRight size={18}/>
             </a>
           </div>

           <div className="absolute bottom-10 text-zinc-600 text-[10px] tracking-[0.3em] uppercase">
              © 2025 GastroLab Mobile
           </div>
        </div>
      )}
    </>
  );
}