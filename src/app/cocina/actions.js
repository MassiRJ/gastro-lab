'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// TUS CREDENCIALES
const URL = "https://dpjhsqwytgdircxnspff.supabase.co"
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw"
const supabase = createClient(URL, KEY)

// FUNCION 1: COCINA -> MESA ATENDIDA
export async function marcarPedidoAtendido(id) {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'atendido' }) // Cambia estado, no borra
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/cocina')
  revalidatePath('/caja') // Avisa a la caja que hay una mesa lista
  return { success: true }
}

// FUNCION 2: CAJA -> COBRAR Y CERRAR
export async function cobrarPedido(id) {
  const { error } = await supabase
    .from('orders')
    .update({ 
      status: 'pagado', 
      payment_status: 'paid' 
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/caja')
  return { success: true }
}
