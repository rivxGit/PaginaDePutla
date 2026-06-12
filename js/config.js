// 1. Configura las credenciales reales de tu Supabase
const SUPABASE_URL = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2M2F1b2I0MH0.xGmge2VPqKK96RcYKjZMQYN";

// 2. Inicializa la conexión global usando la 's' minúscula oficial
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
