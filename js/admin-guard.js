const ADMIN_PASSWORD = "Kevdsant";

function requireAdminPassword(stayHereIfOk = true) {
  const ok = localStorage.getItem("admin_ok");

  if (ok === "true") return true;

  const inserted = prompt("Inserisci la password admin:");

  if (!inserted) {
    alert("Accesso annullato");
    window.location.href = "../index.html".replace("../", "");
    return false;
  }

  if (inserted.trim() === ADMIN_PASSWORD) {
    localStorage.setItem("admin_ok", "true");

    if (stayHereIfOk) {
      window.location.reload();
    }
    return true;
  }

  alert("Password errata");
  window.location.href = "../index.html".replace("../", "");
  return false;
}

requireAdminPassword(false);
