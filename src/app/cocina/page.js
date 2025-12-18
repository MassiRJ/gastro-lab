const markAsReady = async (id) => {
    // 1. Intentamos actualizar en la base de datos
    const { error } = await supabase
      .from("orders")
      .update({ status: 'listo' }) // Cambiamos a 'listo'
      .eq('id', id);
      
    if (error) {
      // 2. Si falla, mostramos por qué
      alert("Error al actualizar: " + error.message);
      console.error(error);
    } else {
      // 3. Si funciona, lo quitamos de la pantalla inmediatamente
      setOrders(prevOrders => prevOrders.filter((o) => o.id !== id));
      
      // Opcional: Forzar una recarga real de datos por si acaso
      fetchOrders(); 
    }
  };