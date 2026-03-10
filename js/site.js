// MENU LATERALE
function setupMenu(){
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const backdrop = document.getElementById("sidebarBackdrop");

  if(!sidebar || !hamburger) return;

  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("show");
  });

  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
  });
}


// FORMATTA DATA ITALIANA
function formatDateIT(dateStr){
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


// CARICA SERATE DA SUPABASE
async function loadEvents(){
  const { data, error } = await supabaseClient
    .from("serate")
    .select("*")
    .order("data", { ascending: true });

  if(error){
    console.error(error);
    return [];
  }

  return data;
}


// TROVA PROSSIMA E ULTIMA SERATA
function getNextAndLast(events){

  const now = new Date();

  let nextEvent = null;
  let lastEvent = null;

  for(const ev of events){

    const evDate = new Date(ev.data);

    if(evDate >= now){
      if(!nextEvent) nextEvent = ev;
    }

    if(evDate < now){
      lastEvent = ev;
    }
  }

  return { nextEvent, lastEvent };
}



// CREA CARD SERATA
function renderEventCard(container, ev){

  if(!container) return;

  if(!ev){
    container.innerHTML = `<div class="card note">Nessuna serata disponibile</div>`;
    return;
  }

  container.innerHTML = `
  <div class="card event-card">

    <div>
      <img src="img/${ev.locandina}" alt="${ev.titolo}">
    </div>

    <div>
      <h3 class="event-title">${ev.titolo}</h3>

      <p class="meta">
        ${formatDateIT(ev.data)}
      </p>

      <p><strong>Menù:</strong> ${ev.menu}</p>

      <p><strong>Programma:</strong> ${ev.programma}</p>

      <div class="button-row">
        <a class="button" href="evento.html?id=${ev.id}">
        Apri serata
        </a>

        ${ev.link_apple ? `
        <a class="button secondary"
           href="${ev.link_apple}"
           target="_blank">
           Partecipa
        </a>
        ` : ""}
      </div>

    </div>

  </div>
  `;
}



// HOME
async function renderHome(){

  const nextBox = document.getElementById("nextEventBox");
  const lastBox = document.getElementById("lastEventBox");

  if(!nextBox && !lastBox) return;

  const events = await loadEvents();

  const { nextEvent, lastEvent } = getNextAndLast(events);

  renderEventCard(nextBox, nextEvent);
  renderEventCard(lastBox, lastEvent);
}



// PAGINA SERATE
async function renderEventsPage(){

  const container = document.getElementById("eventsList");

  if(!container) return;

  const events = await loadEvents();

  container.innerHTML = "";

  events.forEach(ev => {

    const article = document.createElement("article");

    article.className = "card event-card";

    article.innerHTML = `
      <div>
        <img src="img/${ev.locandina}" alt="${ev.titolo}">
      </div>

      <div>
        <h3 class="event-title">${ev.titolo}</h3>

        <p class="meta">
          ${formatDateIT(ev.data)}
        </p>

        <p><strong>Menù:</strong> ${ev.menu}</p>

        <p><strong>Programma:</strong> ${ev.programma}</p>

        <div class="button-row">
          <a class="button"
          href="evento.html?id=${ev.id}">
          Apri serata
          </a>

          ${ev.link_apple ? `
          <a class="button secondary"
             href="${ev.link_apple}"
             target="_blank">
             Partecipa
          </a>
          ` : ""}
        </div>

      </div>
    `;

    container.appendChild(article);
  });

}



// CALENDARIO
async function renderCalendarPage(){

  const grid = document.getElementById("calendarGrid");

  if(!grid) return;

  const detail = document.getElementById("calendarDetail");

  const events = await loadEvents();

  const map = {};

  events.forEach(ev => {
    const d = new Date(ev.data);
    const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    map[key] = ev;
  });


  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const days = new Date(year, month + 1, 0).getDate();


  grid.innerHTML = "";


  for(let d = 1; d <= days; d++){

    const cell = document.createElement("div");

    cell.className = "calendar-day";

    cell.textContent = d;

    const key = `${year}-${month+1}-${d}`;

    if(map[key]){

      cell.classList.add("has-event");

      const ev = map[key];

      cell.addEventListener("click", () => {

        detail.innerHTML = `
          <div class="card event-card">

            <div>
              <img src="img/${ev.locandina}" alt="${ev.titolo}">
            </div>

            <div>

              <h3>${ev.titolo}</h3>

              <p>${formatDateIT(ev.data)}</p>

              <p><strong>Menù:</strong> ${ev.menu}</p>

              <p><strong>Programma:</strong> ${ev.programma}</p>

              <div class="button-row">
                <a class="button"
                href="evento.html?id=${ev.id}">
                Apri serata
                </a>

                ${ev.link_apple ? `
                <a class="button secondary"
                   href="${ev.link_apple}"
                   target="_blank">
                   Partecipa
                </a>
                ` : ""}
              </div>

            </div>

          </div>
        `;
      });

    }

    grid.appendChild(cell);
  }

}



// AVVIO SITO
document.addEventListener("DOMContentLoaded", () => {

  setupMenu();

  renderHome();

  renderEventsPage();

  renderCalendarPage();

});