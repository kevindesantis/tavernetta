(async () => {
  try {
    if (!window.supabaseClient) return;

    const page = window.location.pathname.split("/").pop() || "index.html";
    const key = `visit_${page}_${new Date().toISOString().slice(0, 10)}`;

    // evita spam di visite dallo stesso dispositivo nella stessa giornata
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    await window.supabaseClient.from("site_visits").insert([
      { page }
    ]);
  } catch (err) {
    console.error("Errore tracking visite:", err);
  }
})();
