// ==========================================
// 1. CREDENCIALES DIRECTAS (AL INICIO DEL ARCHIVO)
// ==========================================
const SUPABASE_URL = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3Nzc1ODgsImV4cCI6MjA5NjM1MzU4OH0.xGmge2VPqKK96RcYKiZMQYN0MVKaH-bf7nZJuaeKDQw";

// Usamos un nombre diferente (como 'clienteSupabase') para que jamás vuelva a chocar
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. TU CÓDIGO DE SIEMPRE (CONTINÚA ABAJO)
// ==========================================
// Aquí abajo dejas intacto el resto de tu lógica, solo asegurándote 
// de que si en tus funciones usabas la palabra "supabase.from", 
// ahora cambies ese pedacito por "clienteSupabase.from".
