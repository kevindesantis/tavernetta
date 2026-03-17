
function setupMenu(){
  const btn = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if(!btn || !sidebar || !backdrop) return;
  const open = ()=>{sidebar.classList.add('open'); backdrop.classList.add('open');}
  const close = ()=>{sidebar.classList.remove('open'); backdrop.classList.remove('open');}
  btn.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  document.querySelectorAll('#sidebar a').forEach(a=>a.addEventListener('click', close));
}
function renderEventCard(container, ev){
  if(!container) return;
  container.innerHTML = `
    <div class="card">
      <h3 class="event-title">${ev.titolo || ''}</h3>
      <div><strong>Data:</strong> ${ev.data || ''}</div>
      ${ev.menu ? `<div style="margin-top:8px;"><strong>Menù</strong><div>${ev.menu}</div></div>`:''}
      ${ev.programma ? `<div style="margin-top:8px;"><strong>Programma</strong><div style="white-space:pre-line">${ev.programma}</div></div>`:''}
    </div>
  `;
}
