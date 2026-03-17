
// Inserisci qui i tuoi valori Supabase se non li hai già nel progetto.
window.SUPABASE_URL = window.SUPABASE_URL || "https://puygpylapxsxyuwggetq.supabase.co";
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eWdweWxhcHhzeHl1d2dnZXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzUxNTAsImV4cCI6MjA4ODc1MTE1MH0.H8gURFF2n4p_luOj-_k6Br9LaA9tlqfEj8AINdhted0";
if (window.supabase && window.SUPABASE_URL.startsWith('https://')) {
  window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase non configurato correttamente.");
}
