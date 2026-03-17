function setupMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!hamburger || !sidebar || !backdrop) return;

  function openMenu() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) closeMenu();
    else openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

function formatDateIT(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function renderEventCard(container, eventObj, opts = {}) {
  if (!container) return;
  if (!eventObj) {
    container.innerHTML = `<div class="card note">Nessuna serata disponibile.</div>`;
    return;
  }
  const btnHref = opts.href || `evento.html?id=${eventObj.id}`;
  const buttonText = opts.buttonText || 'Apri serata';
  container.innerHTML = `
    <div class="card event-card">
      <div>
        <img src="${eventObj.locandina || '../img/logo.png'}" alt="${eventObj.titolo}">
      </div>
      <div>
        <h3 class="event-title">${eventObj.titolo || ''}</h3>
        <p class="meta">${formatDateIT(eventObj.data)}</p>
        ${eventObj.programma ? `<p>${eventObj.programma}</p>` : ''}
        <div class="button-row">
          <a class="button secondary" href="${btnHref}">${buttonText}</a>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', setupMenu);
