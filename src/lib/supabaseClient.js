import { createClient } from '@supabase/supabase-js'

// ⚠️ PEGA AQUÍ TUS DATOS REALES DIRECTAMENTE (SOLO PARA PROBAR)
// No uses process.env por ahora. Pega el texto tal cual entre comillas.
const supabaseUrl = "https://tu-proyecto-id.supabase.co" 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR..." 

export const supabase = createClient(supabaseUrl, supabaseKey)