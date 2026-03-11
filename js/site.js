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
  const { data, error } = await supabaseClient
    .from("serate")
    .select("*")
    .order("data", { ascending: true });

  if (error) {
    console.error("Errore loadEvents:", error);
    return [];
  }

  return data || [];
}

function parseEventDate(dateValue) {
  if (!dateValue) return null;

  if (dateValue instanceof Date) return dateValue;

  const str = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    const onlyDate = str.slice(0, 10);
    const [y, m, d] = onlyDate.split("-").map(Number);
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

function getNextAndLast(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const future = events.filter(e => {
    const d = parseEventDate(e.data);
    return d && d >= today;
  });

  const past = events.filter(e => {
    const d = parseEventDate(e.data);
    return d && d < today;
  });

  return {
    nextEvent: future.length ? future[0] : null,
    lastEvent: past.length ? past[past.length - 1] : null
  };
}

function renderEventCard(container, eventObj, opts = {}) {
  if (!container || !eventObj) {
    if (container) {
      container.innerHTML = `<div class="card note">Nessuna serata disponibile.</div>`;
    }
    return;
  }

  const { showButtons = true } = opts;

  container.innerHTML = `
    <div class="card event-card">
      <div>
        <img src="${eventObj.locandina}" alt="${eventObj.titolo}">
      </div>
      <div>
        <h3 class="event-title">${eventObj.titolo}</h3>
        <p class="meta">${formatDateIT(eventObj.data)}</p>
        <p><strong>Menù:</strong> ${eventObj.menu}</p>
        <p><strong>Programma:</strong> ${eventObj.programma}</p>
        <div class="button-row">
          <a class="button" href="evento.html?id=${eventObj.id}">Apri serata</a>
          ${
            showButtons && eventObj.link_apple
              ? `<a class="button secondary" href="${eventObj.link_apple}" target="_blank" rel="noopener noreferrer">Invito Apple</a>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

async function renderHome() {
  const nextBox = document.getElementById("nextEventBox");
  const lastBox = document.getElementById("lastEventBox");
  if (!nextBox && !lastBox) return;

  const events = await loadEvents();
  const { nextEvent, lastEvent } = getNextAndLast(events);

  renderEventCard(nextBox, nextEvent, { showButtons: true });
  renderEventCard(lastBox, lastEvent, { showButtons: false });
}

async function renderEventsPage() {
  const list = document.getElementById("eventsList");
  if (!list) return;

  const events = await loadEvents();
  list.innerHTML = "";

  if (!events.length) {
    list.innerHTML = `<div class="card note">Nessuna serata disponibile.</div>`;
    return;
  }

  events
    .slice()
    .sort((a, b) => parseEventDate(b.data) - parseEventDate(a.data))
    .forEach(ev => {
      const article = document.createElement("article");
      article.className = "event-tile";
      article.innerHTML = `
        <img src="${ev.locandina}" alt="${ev.titolo}">
        <div class="inner">
          <h3 class="event-title">${ev.titolo}</h3>
          <p class="meta">${formatDateIT(ev.data)}</p>
          <p><strong>Menù:</strong> ${ev.menu}</p>
          <div class="button-row">
            <a class="button" href="evento.html?id=${ev.id}">Apri serata</a>
            ${ev.link_apple ? `<a class="button secondary" href="${ev.link_apple}" target="_blank" rel="noopener noreferrer">Invito Apple</a>` : ""}
          </div>
        </div>
      `;
      list.appendChild(article);
    });
}

async function renderCalendarPage() {
  const mount = document.getElementById("calendarMount");
  const detail = document.getElementById("calendarDetail");
  const title = document.getElementById("calendarTitle");
  const prevBtn = document.getElementById("prevMonthBtn");
  const nextBtn = document.getElementById("nextMonthBtn");

  if (!mount || !detail || !title || !prevBtn || !nextBtn) return;

  const events = await loadEvents();

  let current = new Date();
  let currentYear = current.getFullYear();
  let currentMonth = current.getMonth();

  const monthNames = [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"
  ];

  const normalizedEvents = events
    .map(ev => ({
      ...ev,
      parsedDate: parseEventDate(ev.data)
    }))
    .filter(ev => ev.parsedDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstFuture = normalizedEvents
    .filter(ev => ev.parsedDate >= today)
    .sort((a, b) => a.parsedDate - b.parsedDate)[0];

  if (firstFuture) {
    currentYear = firstFuture.parsedDate.getFullYear();
    currentMonth = firstFuture.parsedDate.getMonth();
  }

  function drawCalendar(year, month) {
    mount.innerHTML = "";
    title.textContent = `${monthNames[month]} ${year}`;

    ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].forEach(label => {
      const h = document.createElement("div");
      h.className = "calendar-head";
      h.textContent = label;
      mount.appendChild(h);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const eventMap = new Map();
    normalizedEvents.forEach(ev => {
      if (
        ev.parsedDate.getFullYear() === year &&
        ev.parsedDate.getMonth() === month
      ) {
        const day = ev.parsedDate.getDate();
        eventMap.set(day, ev);
      }
    });

    for (let i = 0; i < startWeekday; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-day empty";
      mount.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {
      const ev = eventMap.get(day);

      const cell = document.createElement("div");
      cell.className = "calendar-day" + (ev ? " has-event" : "");
      cell.innerHTML = `<div class="num">${day}</div>${ev ? `<div class="dot"></div>` : ""}`;

      if (ev) {
        cell.addEventListener("click", () => {
          detail.innerHTML = `
            <div class="card event-card">
              <div>
                <img src="${ev.locandina}" alt="${ev.titolo}">
              </div>
              <div>
                <h3 class="event-title">${ev.titolo}</h3>
                <p class="meta">${formatDateIT(ev.data)}</p>
                <p><strong>Menù:</strong> ${ev.menu}</p>
                <p><strong>Programma:</strong> ${ev.programma}</p>
                <div class="button-row">
                  <a class="button" href="evento.html?id=${ev.id}">Apri serata</a>
                  ${ev.link_apple ? `<a class="button secondary" href="${ev.link_apple}" target="_blank" rel="noopener noreferrer">Invito Apple</a>` : ""}
                </div>
              </div>
            </div>
          `;
        });
      }

      mount.appendChild(cell);
    }

    detail.innerHTML = `<div class="card note">Clicca una data evidenziata per vedere la serata.</div>`;
  }

  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    drawCalendar(currentYear, currentMonth);
  });

  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    drawCalendar(currentYear, currentMonth);
  });

  drawCalendar(currentYear, currentMonth);
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupSlider();
  renderHome();
  renderEventsPage();
  renderCalendarPage();
});
