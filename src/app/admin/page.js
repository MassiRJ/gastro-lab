"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { 
  Plus, Trash2, Edit, Save, X, ChefHat, 
  ToggleLeft, ToggleRight, Loader2, LogOut, Image as ImageIcon, UploadCloud 
} from "lucide-react";

export default function AdminMenu() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado Formulario
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: "", desc: "", price: "", category: "Entradas", available: true, image_url: "" });
  const [imageFile, setImageFile] = useState(null); // Nuevo estado para el archivo
  const [uploading, setUploading] = useState(false);

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

  // --- 3. SUBIR IMAGEN (Lógica Nueva) ---
  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir al bucket 'menu-images'
    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- 4. GUARDAR ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return alert("Faltan datos");

    setUploading(true);
    let finalImageUrl = formData.image_url;

    try {
        // Si hay una nueva imagen seleccionada, la subimos primero
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }

        const payload = {
            title: formData.title,
            desc: formData.desc, // Asegúrate de que tu columna se llame 'desc'
            price: parseFloat(formData.price),
            category: formData.category,
            available: formData.available,
            image_url: finalImageUrl // Guardamos el link
        };

        if (formData.id) {
            const { error } = await supabase.from("menu_items").update(payload).eq("id", formData.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from("menu_items").insert([payload]);
            if (error) throw error;
        }

        fetchItems();
        resetForm();

    } catch (error) {
        alert("Error al guardar: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("¿Seguro que quieres borrar este plato?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    fetchItems();
  };

  const toggleAvailability = async (item) => {
    await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id);
    fetchItems();
  };

  const editItem = (item) => {
    setFormData(item);
    setImageFile(null); // Reseteamos el archivo local al editar
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ id: null, title: "", desc: "", price: "", category: "Entradas", available: true, image_url: "" });
    setImageFile(null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!authorized) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin text-amber-500" size={48}/></div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      
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
        
        {/* --- FORMULARIO --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl h-fit shadow-xl sticky top-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {isEditing ? <Edit size={20} className="text-amber-500"/> : <Plus size={20} className="text-emerald-500"/>}
                {isEditing ? "Editar Plato" : "Nuevo Plato"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
                {/* SUBIDA DE IMAGEN */}
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center hover:bg-zinc-800/50 transition-colors relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                        {imageFile ? (
                             <div className="text-emerald-500 font-bold flex items-center gap-2"><ImageIcon size={20}/> {imageFile.name}</div>
                        ) : formData.image_url ? (
                             <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                 <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover opacity-60"/>
                                 <div className="absolute inset-0 flex items-center justify-center font-bold text-white bg-black/50">Cambiar Imagen</div>
                             </div>
                        ) : (
                             <><UploadCloud size={32}/><span className="text-xs uppercase font-bold">Subir Foto del Plato</span></>
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nombre</label>
                    <input className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-amber-500 outline-none" 
                        value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Ej. Lomo Saltado" required/>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Descripción</label>
                    <textarea className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-amber-500 outline-none text-sm h-20 resize-none" 
                        value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} placeholder="Ingredientes..."/>
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
                    {isEditing && <button type="button" onClick={resetForm} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold">Cancelar</button>}
                    <button type="submit" disabled={uploading} className="flex-[2] bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                        {uploading ? <Loader2 className="animate-spin"/> : <><Save size={18}/> {isEditing ? "Actualizar" : "Guardar"}</>}
                    </button>
                </div>
            </form>
        </div>

        {/* --- LISTA DE PLATOS --- */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['Todos', 'Entradas', 'Fondos', 'Bebidas'].map(cat => (
                    <span key={cat} className="px-4 py-1 rounded-full border border-zinc-800 text-xs font-bold uppercase text-zinc-500 whitespace-nowrap">{cat}</span>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.length === 0 ? (
                    <div className="text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-xl"><p>No hay platos registrados.</p></div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className={`bg-zinc-900 border rounded-xl p-3 flex items-center gap-4 hover:border-zinc-600 ${!item.available ? 'border-red-900/30 opacity-60' : 'border-zinc-800'}`}>
                            
                            {/* MINIATURA DE IMAGEN */}
                            <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon size={20}/></div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold bg-zinc-950 px-2 py-0.5 rounded text-zinc-500 uppercase">{item.category}</span>
                                    {!item.available && <span className="text-[10px] font-bold bg-red-900/50 text-red-400 px-2 py-0.5 rounded uppercase">Agotado</span>}
                                </div>
                                <h3 className="text-base font-bold text-white">{item.title}</h3>
                                <p className="text-zinc-500 text-xs line-clamp-1">{item.desc}</p>
                            </div>

                            <div className="text-lg font-mono font-bold text-amber-500">S/ {item.price.toFixed(2)}</div>

                            <div className="flex gap-1">
                                <button onClick={() => toggleAvailability(item)} className={`p-2 rounded-lg ${item.available ? 'text-emerald-500' : 'text-red-500'}`}><ToggleRight size={20}/></button>
                                <button onClick={() => editItem(item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit size={18}/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18}/></button>
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