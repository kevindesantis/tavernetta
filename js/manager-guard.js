const MANAGER_PASSWORD = "Kevdsant";
(function(){
  const path = location.pathname.replace(/\\/g,'/');
  const isLogin = path.endsWith('/manager/login.html') || path.endsWith('/login.html');
  const ok = localStorage.getItem('manager_auth_ok') === 'true';
  if (!ok && !isLogin) {
    location.href = 'login.html';
  }
})();
