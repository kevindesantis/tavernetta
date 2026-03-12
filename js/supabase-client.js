window.addEventListener("load", async () => {
  try {
    if (!window.supabaseClient) {
      console.log("track-visit: supabaseClient non trovato");
      return;
    }

    const page = window.location.pathname.split("/").pop() || "index.html";
    const today = new Date().toISOString().slice(0, 10);
    const key = `visit_${page}_${today}`;

    if (sessionStorage.getItem(key)) {
      console.log("track-visit: visita già contata");
      return;
    }

    const { error } = await window.supabaseClient
      .from("site_visits")
      .insert([{ page }]);

    if (error) {
      console.log("track-visit insert error", error);
      return;
    }

    sessionStorage.setItem(key, "1");
    console.log("track-visit: visita registrata", page);
  } catch (err) {
    console.log("track-visit fatal error", err);
  }
});
