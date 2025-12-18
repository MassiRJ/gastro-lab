import { createClient } from '@supabase/supabase-js'

// 1. Pega tu URL aquí (Asegúrate que NO tenga "/" al final)
const supabaseUrl = "https://dpjhsqwytgdircxnspff.supabase.co"

// 2. Pega tu ANON KEY aquí (Cuidado con los espacios al inicio o final)
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwamhzcXd5dGdkaXJjeG5zcGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTg2OTEsImV4cCI6MjA4MTU3NDY5MX0.VMt2OpPuJllAPHHQN_eeD1gY-MIVWof6e_ao-XsKVGw"

// 3. Configuración extra para evitar errores de red (Reintentos)
const options = {
  auth: {
    persistSession: true, // Mantiene la sesión iniciada
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => fetch(...args), // Fuerza el uso del fetch nativo
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, options)