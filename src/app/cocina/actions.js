'use server' 
// 👆 Esa primera línea es MAGIA. Convierte este archivo en código seguro de servidor.

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// ⚠️ PEGA TUS CLAVES AQUÍ (Sí, otra vez, para asegurar que el servidor las tenga)
const supabaseUrl = "https://dpjhsqwytgdircxnspff.supabase.co" 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw"

const supabase = createClient(supabaseUrl, supabaseKey)

export async function marcarComoListo(id) {
  console.log("🚀 Servidor recibiendo orden ID:", id)

  // Esto se ejecuta en Vercel, NO en el navegador del cliente.
  // Aquí no existe AdBlock, ni CORS, ni fallos de fetch.
  const { error } = await supabase
    .from('orders')
    .update({ status: 'listo' })
    .eq('id', id)

  if (error) {
    console.error("Error en servidor:", error)
    throw new Error(error.message)
  }

  // Esto avisa a la página que los datos cambiaron para que se refresque sola
  revalidatePath('/cocina')
  return { success: true }
}