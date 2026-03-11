const ADMIN_PASSWORD = "Kevdsa";

function requireAdminPassword() {
  const ok = localStorage.getItem("admin_ok");

  if (ok === "true") return;

  const inserted = prompt("Inserisci la password admin:");

  if (!inserted) {
    alert("Accesso annullato");
    window.location.href = "index.html";
    return;
  }

  if (inserted.trim() === ADMIN_PASSWORD) {
    localStorage.setItem("admin_ok", "true");
    return;
  }

  alert("Password errata");
  window.location.href = "index.html";
}

requireAdminPassword();
