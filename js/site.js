const WHATSAPP_NUMBER = "393333117937";

function setupMenu() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");

  if (!hamburger || !sidebar || !backdrop) return;

  const openMenu = () => {
    sidebar.classList.add("open");
    backdrop.classList.add("open");
  };

  const closeMenu = () => {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
  };

  hamburger.addEventListener("click", openMenu);
  backdrop.addEventListener("click", closeMenu);

  sidebar.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", closeMenu);
  });
}

function setupSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = [...slider.querySelectorAll(".hero-slide")];
  const dots = [...slider.querySelectorAll(".slider-dots button")];
  let index = 0;

  const show = (i) => {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    index = i;
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => show(i));
  });

  setInterval(() => {
    show((index + 1) % slides.length);
  }, 4000);
}

async function loadEvents() {
  const res = await fetch("data/serate.json");
  if (!res.ok) throw new Error("Impossibile leggere serate.json");
  const data = await res.json();
  return data.sort((a, b) => new Date(a.data) - new Date(b.data));
}

function formatDateIT(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getNextAndLast(events) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const future = events.filter(e => {
    const d = new Date(e.data + "T00:00:00");
    return d >= today;
  });

  const past = events.filter(e => {
    const d = new Date(e.data + "T00:00:00");
    return d < today;
  });

  return {
    nextEvent: future.length ? future[0] : null,
    lastEvent: past.length ? past[past.length - 1] : null
  };
}

function createWhatsAppLink(eventObj) {
  const text =
`Ciao Kevin!
Vorrei prenotare per la serata del ${formatDateIT(eventObj.data)}.

Nome:
Numero persone:`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function renderEventCard(container, eventObj, opts = {}) {
  if (!container || !eventObj) {
    if (container) {
      container.innerHTML = `<div class="card note">Nessuna serata disponibile.</div>`;
    }
    return;
  }

  const {
    titleOverride = "",
    showProgram = true,
    showButtons = true
  } = opts;

  container.innerHTML = `
    <div class="card event-card">
      <div>
        <img src="img/${eventObj.locandina}" alt="${eventObj.titolo}">
      </div>
      <div>
        <h3 class="event-title">${titleOverride || eventObj.titolo}</h3>
        <p class="meta">${formatDateIT(eventObj.data)}</p>
        <p><strong>Menù:</strong> ${eventObj.menu}</p>
        ${showProgram ? `<p><strong>Programma:</strong> ${eventObj.programma}</p>` : ""}
        ${eventObj.descrizione ? `<p>${eventObj.descrizione}</p>` : ""}
        ${showButtons ? `
          <div class="button-row">
            ${eventObj.linkApple ? `<a class="button" href="${eventObj.linkApple}" target="_blank" rel="noopener noreferrer">Partecipa</a>` : ""}
            <a class="button secondary" href="${createWhatsAppLink(eventObj)}" target="_blank" rel="noopener noreferrer">Prenota posto</a>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

async function renderHome() {
  const nextBox = document.getElementById("nextEventBox");
  const lastBox = document.getElementById("lastEventBox");
  if (!nextBox && !lastBox) return;

  try {
    const events = await loadEvents();
    const { nextEvent, lastEvent } = getNextAndLast(events);
    renderEventCard(nextBox, nextEvent);
    renderEventCard(lastBox, lastEvent, { showButtons: false });
  } catch {
    if (nextBox) nextBox.innerHTML = `<div class="card note">Errore nel caricamento eventi.</div>`;
    if (lastBox) lastBox.innerHTML = `<div class="card note">Errore nel caricamento eventi.</div>`;
  }
}

async function renderEventsPage() {
  const list = document.getElementById("eventsList");
  if (!list) return;

  try {
    const events = await loadEvents();
    list.innerHTML = "";

    events.slice().reverse().forEach(ev => {
      const article = document.createElement("article");
      article.className = "event-tile";
      article.innerHTML = `
        <img src="img/${ev.locandina}" alt="${ev.titolo}">
        <div class="inner">
          <h3 class="event-title">${ev.titolo}</h3>
          <p class="meta">${formatDateIT(ev.data)}</p>
          <p><strong>Menù:</strong> ${ev.menu}</p>
          <div class="button-row">
            ${ev.linkApple ? `<a class="button" href="${ev.linkApple}" target="_blank" rel="noopener noreferrer">Partecipa</a>` : ""}
            <a class="button secondary" href="${createWhatsAppLink(ev)}" target="_blank" rel="noopener noreferrer">Prenota posto</a>
          </div>
        </div>
      `;
      list.appendChild(article);
    });
  } catch {
    list.innerHTML = `<div class="card note">Errore nel caricamento serate.</div>`;
  }
}

async function renderCalendarPage() {
  const mount = document.getElementById("calendarMount");
  const detail = document.getElementById("calendarDetail");
  if (!mount || !detail) return;

  try {
    const events = await loadEvents();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const map = new Map(events.map(ev => [ev.data, ev]));
    mount.innerHTML = "";

    ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].forEach(label => {
      const h = document.createElement("div");
      h.className = "calendar-head";
      h.textContent = label;
      mount.appendChild(h);
    });

    for (let i = 0; i < startWeekday; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-day empty";
      mount.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {
      const iso = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      const ev = map.get(iso);

      const cell = document.createElement("div");
      cell.className = "calendar-day" + (ev ? " has-event" : "");
      cell.innerHTML = `<div class="num">${day}</div>${ev ? `<div class="dot"></div>` : ""}`;

      if (ev) {
        cell.addEventListener("click", () => {
          detail.innerHTML = "";
          renderEventCard(detail, ev);
        });
      }

      mount.appendChild(cell);
    }

    detail.innerHTML = `<div class="card note">Clicca una data evidenziata per vedere la serata.</div>`;
  } catch {
    mount.innerHTML = `<div class="card note">Errore nel caricamento calendario.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupSlider();
  renderHome();
  renderEventsPage();
  renderCalendarPage();
});