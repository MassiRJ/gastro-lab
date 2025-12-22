"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { 
  Plus, Trash2, Edit, Save, X, ChefHat, 
  ToggleLeft, ToggleRight, Search, Loader2, LogOut 
} from "lucide-react";

export default function AdminMenu() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el Formulario (Crear/Editar)
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: "", desc: "", price: "", category: "Entradas", available: true });

  // --- 1. SEGURIDAD ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login?returnUrl=/admin");
      else { setAuthorized(true); fetchItems(); }
    };
    checkUser();
  }, []);

  // --- 2. CARGAR DATOS ---
  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from("menu_items").select("*").order("category", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  // --- 3. GUARDAR (CREAR O ACTUALIZAR) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return alert("Faltan datos");

    const payload = {
        title: formData.title,
        desc: formData.desc,
        price: parseFloat(formData.price),
        category: formData.category,
        available: formData.available
    };

    let error;
    if (formData.id) {
        // Actualizar
        const { error: err } = await supabase.from("menu_items").update(payload).eq("id", formData.id);
        error = err;
    } else {
        // Crear Nuevo
        const { error: err } = await supabase.from("menu_items").insert([payload]);
        error = err;
    }

    if (error) alert("Error: " + error.message);
    else {
        fetchItems();
        resetForm();
    }
  };

  // --- 4. ELIMINAR ---
  const handleDelete = async (id) => {
    if(!confirm("¿Seguro que quieres borrar este plato?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    fetchItems();
  };

  // --- 5. CAMBIAR DISPONIBILIDAD (STOCK) ---
  const toggleAvailability = async (item) => {
    await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id);
    fetchItems();
  };

  const editItem = (item) => {
    setFormData(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ id: null, title: "", desc: "", price: "", category: "Entradas", available: true });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!authorized) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-zinc-800 pb-6 gap-4">
        <div>
            <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
                <ChefHat className="text-amber-500" size={32}/> Gestión de Carta
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Administra tus productos en tiempo real</p>
        </div>
        <button onClick={handleLogout} className="bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs uppercase font-bold tracking-widest transition-all">
            <LogOut size={16}/> Cerrar Sesión
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- FORMULARIO (IZQUIERDA) --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl h-fit shadow-xl sticky top-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {isEditing ? <Edit size={20} className="text-amber-500"/> : <Plus size={20} className="text-emerald-500"/>}
                {isEditing ? "Editar Plato" : "Nuevo Plato"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nombre del Plato</label>
                    <input className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-amber-500 outline-none" 
                        value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Ej. Lomo Saltado" required/>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Descripción</label>
                    <textarea className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-amber-500 outline-none text-sm h-24 resize-none" 
                        value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} placeholder="Ingredientes y detalles..."/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Precio (S/)</label>
                        <input type="number" step="0.01" className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-amber-500 outline-none font-mono" 
                            value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} placeholder="0.00" required/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Categoría</label>
                        <select className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-amber-500 outline-none cursor-pointer"
                            value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                            <option value="Entradas">Entradas</option>
                            <option value="Fondos">Fondos</option>
                            <option value="Bebidas">Bebidas</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex gap-2">
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold transition-all">Cancelar</button>
                    )}
                    <button type="submit" className="flex-[2] bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20">
                        <Save size={18}/> Guardar Producto
                    </button>
                </div>
            </form>
        </div>

        {/* --- LISTA DE PLATOS (DERECHA) --- */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['Todos', 'Entradas', 'Fondos', 'Bebidas'].map(cat => (
                    <span key={cat} className="px-4 py-1 rounded-full border border-zinc-800 text-xs font-bold uppercase text-zinc-500 whitespace-nowrap">{cat}</span>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.length === 0 ? (
                    <div className="text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                        <p>No hay platos registrados. ¡Agrega el primero!</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className={`bg-zinc-900 border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:border-zinc-600 ${!item.available ? 'border-red-900/30 opacity-60' : 'border-zinc-800'}`}>
                            
                            <div className="flex-1 w-full text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                                    <span className="text-xs font-bold bg-zinc-950 px-2 py-0.5 rounded text-zinc-500 uppercase">{item.category}</span>
                                    {!item.available && <span className="text-xs font-bold bg-red-900/50 text-red-400 px-2 py-0.5 rounded uppercase">Agotado</span>}
                                </div>
                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                <p className="text-zinc-500 text-sm line-clamp-1">{item.desc || "Sin descripción"}</p>
                            </div>

                            <div className="text-xl font-mono font-bold text-amber-500">S/ {item.price.toFixed(2)}</div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                                <button onClick={() => toggleAvailability(item)} className={`p-2 rounded-lg transition-colors ${item.available ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-red-500 hover:bg-red-500/10'}`} title={item.available ? "Disponible" : "Agotado"}>
                                    {item.available ? <ToggleRight size={24}/> : <ToggleLeft size={24}/>}
                                </button>
                                <button onClick={() => editItem(item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Editar">
                                    <Edit size={18}/>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Eliminar">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
}