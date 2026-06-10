// js/config.js

// 1. Configura las credenciales reales de tu Supabase
const SUPABASE_URL = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const SUPABASE_KEY = "PEGA_AQUÍ_TU_LLAVE_LARGA_eyJhbGci..."; 

// 2. Inicializa la conexión global con la base de datos y almacén
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);