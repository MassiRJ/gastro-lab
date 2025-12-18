import { createClient } from '@supabase/supabase-js'

// Tus claves (NO LAS BORRES, usa las que ya sabes que funcionan)
const supabaseUrl = "https://dpjhsqwytgdircxnspff.supabase.co" 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw" 

// Cliente LIMPIO, sin opciones raras que bloqueen la red
export const supabase = createClient(supabaseUrl, supabaseKey)