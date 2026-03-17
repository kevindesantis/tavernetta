
// Inserisci qui i tuoi valori Supabase se non li hai già nel progetto.
window.SUPABASE_URL = window.SUPABASE_URL || "https://YOUR-PROJECT.supabase.co";
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "YOUR-ANON-KEY";
if (window.supabase && window.SUPABASE_URL.startsWith('https://')) {
  window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase non configurato correttamente.");
}
