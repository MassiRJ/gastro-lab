import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ⚠️ PEGA AQUÍ TUS DATOS DIRECTAMENTE PARA QUE NO HAYA FALLOS DE ENV
const supabaseUrl = "https://dpjhsqwytgdircxnspff.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw"; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    console.log("Servidor recibiendo orden para ID:", id);

    // El servidor ejecuta la orden (Aquí no hay fallos de red)
    const { error } = await supabase
      .from('orders')
      .update({ status: 'listo' })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en servidor:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}