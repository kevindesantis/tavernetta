import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Mancano SUPABASE_URL o SUPABASE_ANON_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function parseEventDate(dateValue) {
  if (!dateValue) return null;
  const str = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(str)) {
    const [d, m, y] = str.split(/[-/]/).map(Number);
    return new Date(y, m - 1, d);
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDateIT(dateStr) {
  const d = parseEventDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const { data, error } = await supabase
  .from("serate")
  .select("*")
  .order("data", { ascending: true });

if (error) throw error;

const today = new Date();
today.setHours(0, 0, 0, 0);

const nextEvent = (data || []).find(ev => {
  const d = parseEventDate(ev.data);
  return d && d >= today;
});

const fallbackImage = "https://tavernettadakevin.it/img/whatsapp-preview.png";

let html = "";

if (!nextEvent) {
  html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prossima serata – Tavernetta da Kevin</title>
  <meta name="description" content="Scopri la prossima serata alla Tavernetta da Kevin.">
  <link rel="icon" type="image/png" href="img/logo.png">
  <link rel="stylesheet" href="css/style.css">
  <link rel="canonical" href="https://tavernettadakevin.it/prossima-serata.html">

  <meta property="og:title" content="Prossima serata – Tavernetta da Kevin">
  <meta property="og:description" content="Scopri la prossima serata alla Tavernetta da Kevin.">
  <meta property="og:image" content="${fallbackImage}">
  <meta property="og:image:secure_url" content="${fallbackImage}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://tavernettadakevin.it/prossima-serata.html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Tavernetta da Kevin">
  <meta property="og:locale" content="it_IT">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Prossima serata – Tavernetta da Kevin">
  <meta name="twitter:description" content="Scopri la prossima serata alla Tavernetta da Kevin.">
  <meta name="twitter:image" content="${fallbackImage}">
</head>
<body>
  <div class="top-bar">
    <img src="img/logo.png" alt="Tavernetta da Kevin" class="logo-top">
    <button id="hamburger" class="hamburger" aria-label="Apri menu">☰</button>
  </div>

  <div id="sidebarBackdrop" class="sidebar-backdrop"></div>

  <aside id="sidebar" class="sidebar">
    <img src="img/logo.png" alt="Logo" class="side-logo">
    <nav>
      <a href="index.html">Home</a>
      <a href="serate.html">Serate</a>
      <a href="calendario.html">Calendario</a>
      <a href="dove.html">Dove siamo</a>
      <a href="contatti.html">Contattaci</a>
    </nav>
  </aside>

  <main class="page">
    <section class="section">
      <h2>Prossima serata</h2>
      <div class="card">
        <p>Al momento non ci sono serate future pubblicate.</p>
        <div class="button-row">
          <a class="button" href="index.html">Vai al sito</a>
        </div>
      </div>
    </section>
  </main>

  <script src="js/site.js"></script>
</body>
</html>`;
} else {
  const title = esc(nextEvent.titolo || "Prossima serata");
  const dateText = esc(formatDateIT(nextEvent.data));
  const menu = esc(nextEvent.menu || "");
  const program = esc(nextEvent.programma || "");
  const image = esc(nextEvent.locandina || fallbackImage);
  const eventUrl = `https://tavernettadakevin.it/evento.html?id=${nextEvent.id}`;
  const description = esc(`${dateText} – ${nextEvent.titolo || "Prossima serata"} alla Tavernetta da Kevin. Prenota il tuo posto.`);

  html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${title} – Tavernetta da Kevin</title>
  <meta name="description" content="${description}">

  <link rel="icon" type="image/png" href="img/logo.png">
  <link rel="stylesheet" href="css/style.css">
  <link rel="canonical" href="https://tavernettadakevin.it/prossima-serata.html">

  <meta property="og:title" content="${title} – Tavernetta da Kevin">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://tavernettadakevin.it/prossima-serata.html">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Tavernetta da Kevin">
  <meta property="og:locale" content="it_IT">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} – Tavernetta da Kevin">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <div class="top-bar">
    <img src="img/logo.png" alt="Tavernetta da Kevin" class="logo-top">
    <button id="hamburger" class="hamburger" aria-label="Apri menu">☰</button>
  </div>

  <div id="sidebarBackdrop" class="sidebar-backdrop"></div>

  <aside id="sidebar" class="sidebar">
    <img src="img/logo.png" alt="Logo" class="side-logo">
    <nav>
      <a href="index.html">Home</a>
      <a href="serate.html">Serate</a>
      <a href="calendario.html">Calendario</a>
      <a href="dove.html">Dove siamo</a>
      <a href="contatti.html">Contattaci</a>
    </nav>
  </aside>

  <main class="page">
    <section class="section">
      <h2>Prossima serata</h2>

      <div class="card event-card">
        <div>
          <img src="${image}" alt="${title}">
        </div>
        <div>
          <h3 class="event-title">${title}</h3>
          <p class="meta">${dateText}</p>
          <p><strong>Menù:</strong> ${menu}</p>
          <p><strong>Programma:</strong> ${program}</p>

          <div class="button-row">
            <a class="button" href="${eventUrl}">Prenota ora</a>
            <a class="button secondary" href="index.html">Vai al sito</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <script src="js/site.js"></script>
</body>
</html>`;
}

await Deno.writeTextFile("prossima-serata.html", html);
console.log("prossima-serata.html aggiornato");
