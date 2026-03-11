const ADMIN_PASSWORD = "Kevdsant";

function requireManagerPassword() {
  const ok = localStorage.getItem("admin_ok");

  if (ok === "true") return true;

  const inserted = prompt("Inserisci la password di Tavernetta Manager:");

  if (!inserted) {
    alert("Accesso annullato");
    window.location.href = "../index.html";
    return false;
  }

  if (inserted.trim() === ADMIN_PASSWORD) {
    localStorage.setItem("admin_ok", "true");
    window.location.reload();
    return true;
  }

  alert("Password errata");
  window.location.href = "../index.html";
  return false;
}

requireManagerPassword();
