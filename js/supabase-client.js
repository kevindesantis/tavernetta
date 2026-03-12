const supabaseUrl = "https://puygpylapxsxyuwggetq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eWdweWxhcHhzeHl1d2dnZXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzUxNTAsImV4cCI6MjA4ODc1MTE1MH0.H8gURFF2n4p_luOj-_k6Br9LaA9tlqfEj8AINdhted0";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseClient = supabaseClient;
