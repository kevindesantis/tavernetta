const ADMIN_PASSWORD = "Kevdsnt3121131...,";

function requireAdminPassword() {
  const ok = sessionStorage.getItem("admin_ok");

  if (ok === "true") return;

  const inserted = prompt("Inserisci la password admin:");

  if (inserted === ADMIN_PASSWORD) {
    sessionStorage.setItem("admin_ok", "true");
  } else {
    alert("Password errata");
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", requireAdminPassword);