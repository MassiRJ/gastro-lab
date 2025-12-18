import { createClient } from '@supabase/supabase-js'

// ⚠️ PEGA AQUÍ TU URL (Debe empezar con https:// y NO tener espacios)
const supabaseUrl = "https://dpjhsqwytgdircxnspff.supabase.co" 

// ⚠️ PEGA AQUÍ TU ANON KEY (El texto largo eyJ...)
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw" 

// Creamos el cliente directo
export const supabase = createClient(supabaseUrl, supabaseKey)