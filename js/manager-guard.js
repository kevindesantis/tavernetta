
// Guard semplice: se vuoi puoi sostituirlo con il tuo login già esistente.
document.addEventListener("DOMContentLoaded", ()=>{
  const allowed = localStorage.getItem("manager_auth_ok");
  if (allowed !== "true" && !location.pathname.endsWith("/login.html")) {
    // commenta le prossime 2 righe se nel tuo progetto usi un altro sistema
    // location.href = "login.html";
  }
});
