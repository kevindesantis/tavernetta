
document.addEventListener("DOMContentLoaded", async ()=>{
  if (!window.supabaseClient) return;
  try{
    await supabaseClient.from("site_visits").insert([{
      path: location.pathname + location.search,
      visited_at: new Date().toISOString()
    }]);
  }catch(e){ console.warn("track visit skipped", e); }
});
