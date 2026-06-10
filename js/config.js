// Configuración de credenciales de Supabase
const SUPABASE_URL = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3Nzc1ODgsImV4cCI6MjA5NjM1MzU4OH0.xGmge2VPqKK96RcYKiZMQYN0MVKaH-bf7nZJuaeKDQw";

// Inicialización de la conexión
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
