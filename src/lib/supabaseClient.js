import { createClient } from '@supabase/supabase-js'

// ⚠️ PEGA AQUÍ TUS DATOS REALES DIRECTAMENTE (SOLO PARA PROBAR)
// No uses process.env por ahora. Pega el texto tal cual entre comillas.
const supabaseUrl = "https://dpjhsqwytgdircxnspff.supabase.co" 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw" 

export const supabase = createClient(supabaseUrl, supabaseKey)