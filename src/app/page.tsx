// ... (El resto de imports y código igual hasta la parte del return del Home) ...

// BUSCA ESTA SECCIÓN DENTRO DE Home() -> return -> section#menu
// Y REEMPLAZA EL .map INTERNO CON ESTO:

itemsToShow.map((item) => (
<div key={item.id} className="group cursor-pointer">
    
    {/* ZONA DE IMAGEN */}
    <div className="h-64 bg-zinc-900 relative overflow-hidden mb-6 rounded-2xl border border-zinc-800">
        
        {/* Si tiene imagen_url, mostramos la foto. Si no, mostramos la letra */}
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
        
        {/* PRECIO FLOTANTE */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700 z-20">
             <span className="text-amber-500 font-mono font-bold">S/ {item.price.toFixed(2)}</span>
        </div>
    </div>

    {/* INFO DEL PLATO */}
    <div className="relative px-2">
        <div className="flex justify-between items-baseline mb-2">
             <h3 className="text-xl font-bold text-white uppercase tracking-wider group-hover:text-amber-500 transition-colors">{item.title}</h3>
        </div>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed min-h-[40px] line-clamp-2">{item.desc || "Exquisita preparación de la casa."}</p>
        
        <button 
            onClick={() => addToCart(item)} 
            className="w-full border border-zinc-800 hover:bg-white hover:text-black hover:border-white text-white py-4 font-bold flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-[0.2em] rounded-xl"
        >
            <Plus size={16} /> Agregar al Pedido
        </button>
    </div>
</div>
))