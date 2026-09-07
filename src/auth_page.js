import { SITE, seoHead, marketingCss } from './site_theme.js';

export function getAuthPageHtml(initialTab = 'login') {
  const title = initialTab === 'register'
    ? 'Crear cuenta — Trujillo AI'
    : 'Acceder — Trujillo AI';
  const description = 'Entra en Trujillo AI o crea una cuenta para sincronizar el workspace.';
  const path = initialTab === 'register' ? '/register' : '/login';
  const head = seoHead({ title, description, path, robots: 'index, follow' });

  return `${head}
  <style>
    ${marketingCss}
    body { display:flex; flex-direction:column; min-height:100vh; }
    .auth-shell { flex:1; display:flex; align-items:center; justify-content:center; padding: 40px 20px 64px; }
    .auth-card {
      width: 100%; max-width: 420px;
      background: var(--bg-card);
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 32px 28px;
    }
    .auth-brand { display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; margin-bottom: 8px; }
    .auth-brand img { width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--line-strong); }
    .auth-brand h1 { font-size: 1.35rem; letter-spacing: -0.04em; font-weight: 650; }
    .auth-brand p { color: var(--muted); font-size: 0.88rem; }
    .tabs-nav {
      display:grid; grid-template-columns:1fr 1fr; gap:4px;
      background: rgba(255,255,255,0.04); padding:4px; border-radius:999px; margin: 18px 0 16px;
    }
    .tab-btn {
      background:none; border:none; color:var(--muted); font-family:var(--font);
      font-size:0.86rem; font-weight:600; padding:9px 12px; border-radius:999px; cursor:pointer;
    }
    .tab-btn.active { background:#fff; color:#000; }
    .field-group { display:flex; flex-direction:column; gap:6px; text-align:left; }
    .field-label { font-size:0.78rem; font-weight:600; color:var(--muted); }
    .field-input {
      background:#0a0a0a; border:1px solid var(--line); color:#fff; font-family:var(--font);
      font-size:0.92rem; padding:11px 14px; border-radius:12px; outline:none;
    }
    .field-input:focus { border-color: var(--line-strong); }
    .btn-submit {
      background:#fff; color:#000; font-family:var(--font); font-weight:650; font-size:0.92rem;
      padding:12px 18px; border-radius:999px; border:none; cursor:pointer; margin-top:4px;
    }
    .btn-submit:disabled { opacity:0.5; cursor:not-allowed; }
    .alert-banner { padding:10px 14px; border-radius:12px; font-size:0.82rem; display:none; }
    .alert-error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; }
    .alert-success { background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.3); color:#86efac; }
    .ghost-link { background:none; border:none; color:var(--muted); font-size:0.8rem; cursor:pointer; }
    .guest-action-wrap { text-align:center; margin-top:16px; padding-top:14px; border-top:1px solid var(--line); }
    .auth-footer { display:flex; justify-content:center; gap:14px; font-size:0.76rem; color:var(--dim); margin-top:14px; }
    .auth-footer a { color:var(--dim); text-decoration:none; }
    .auth-footer a:hover { color:#fff; }
    @media (max-width: 480px) {
      .auth-shell { padding: 20px 12px 40px; }
      .auth-card { padding: 22px 16px; border-radius: 18px; }
      .field-input { font-size: 16px; }
      .site-nav-inner { width: calc(100% - 24px); }
    }
  </style>
</head>
<body>
  <nav class="site-nav" aria-label="Principal">
    <div class="site-nav-inner">
      <a class="brand" href="/">
        <img src="/avatar.png" alt="Trujillo AI">
        <span>Trujillo AI</span>
      </a>
      <div class="nav-cta">
        <a class="btn btn-ghost" href="/docs">Documentación</a>
        <a class="btn btn-white" href="/">Chat</a>
      </div>
    </div>
  </nav>
  <main class="auth-shell">
    <div class="auth-card">
      <div class="auth-brand">
        <img src="/avatar.png" alt="Trujillo AI">
        <h1>Trujillo AI</h1>
        <p>Entra para guardar historial, proyectos y documentos.</p>
      </div>
      <div id="alert-box" class="alert-banner alert-error"></div>
      <div class="tabs-nav" id="auth-tabs">
        <button class="tab-btn ${initialTab === 'login' ? 'active' : ''}" id="tab-login-btn" onclick="switchAuthTab('login')">Acceder</button>
        <button class="tab-btn ${initialTab === 'register' ? 'active' : ''}" id="tab-reg-btn" onclick="switchAuthTab('register')">Crear cuenta</button>
      </div>

      <form id="form-login" onsubmit="handleLoginSubmit(event)" style="display:${initialTab === 'login' ? 'flex' : 'none'}; flex-direction:column; gap:14px;">
        <div class="field-group">
          <label class="field-label">Correo</label>
          <input type="email" class="field-input" id="login-email" placeholder="tu@correo.com" required autocomplete="email">
        </div>
        <div class="field-group">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label class="field-label">Contraseña</label>
            <button type="button" onclick="switchAuthTab('forgot')" class="ghost-link">¿Olvidaste la contraseña?</button>
          </div>
          <input type="password" class="field-input" id="login-password" placeholder="••••••••" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn-submit" id="login-btn">Continuar</button>
      </form>

      <form id="form-forgot" onsubmit="handleForgotSubmit(event)" style="display:none; flex-direction:column; gap:14px;">
        <div style="text-align:center;">
          <div style="font-weight:650; color:#fff;">Recuperar contraseña</div>
          <p style="font-size:0.84rem; color:var(--muted); margin-top:4px;">Te enviamos un código de 6 dígitos.</p>
        </div>
        <div class="field-group">
          <label class="field-label">Correo</label>
          <input type="email" class="field-input" id="forgot-email" placeholder="tu@correo.com" required autocomplete="email">
        </div>
        <button type="submit" class="btn-submit" id="forgot-btn">Enviar código</button>
        <button type="button" onclick="switchAuthTab('login')" class="ghost-link">← Volver</button>
      </form>

      <form id="form-reset" onsubmit="handleResetSubmit(event)" style="display:none; flex-direction:column; gap:14px;">
        <div style="text-align:center;">
          <div style="font-weight:650; color:#fff;">Nueva contraseña</div>
          <p style="font-size:0.84rem; color:var(--muted); margin-top:4px;">Código de 6 dígitos y la contraseña nueva.</p>
        </div>
        <div class="field-group">
          <label class="field-label">Correo</label>
          <input type="email" class="field-input" id="reset-email" placeholder="tu@correo.com" required autocomplete="email">
        </div>
        <div class="field-group">
          <label class="field-label">Código</label>
          <input type="text" class="field-input" id="reset-code" maxlength="24" placeholder="123456" inputmode="numeric" autocomplete="one-time-code" style="text-align:center; font-size:1.5rem; font-weight:700; letter-spacing:0.12em; font-family:var(--mono);" required>
        </div>
        <div class="field-group">
          <label class="field-label">Nueva contraseña (mín. 6)</label>
          <input type="password" class="field-input" id="reset-new-password" placeholder="••••••••" minlength="6" required autocomplete="new-password">
        </div>
        <button type="submit" class="btn-submit" id="reset-btn">Guardar y entrar</button>
        <button type="button" onclick="switchAuthTab('forgot')" class="ghost-link">← Otro código</button>
      </form>

      <form id="form-register" onsubmit="handleRegisterSubmit(event)" style="display:${initialTab === 'register' ? 'flex' : 'none'}; flex-direction:column; gap:14px;">
        <div class="field-group">
          <label class="field-label">Nombre</label>
          <input type="text" class="field-input" id="reg-name" placeholder="Tu nombre" required autocomplete="name">
        </div>
        <div class="field-group">
          <label class="field-label">Correo</label>
          <input type="email" class="field-input" id="reg-email" placeholder="tu@correo.com" required autocomplete="email">
        </div>
        <div class="field-group">
          <label class="field-label">Contraseña (mín. 6)</label>
          <input type="password" class="field-input" id="reg-password" placeholder="••••••••" minlength="6" required autocomplete="new-password">
        </div>
        <button type="submit" class="btn-submit" id="reg-btn">Crear cuenta</button>
      </form>

      <form id="form-verify" onsubmit="handleVerifySubmit(event)" style="display:none; flex-direction:column; gap:14px; text-align:center;">
        <p style="font-size:0.86rem; color:var(--muted);">Código enviado a <strong id="verify-email-display" style="color:#fff;"></strong></p>
        <div class="field-group" style="align-items:center;">
          <input type="text" class="field-input" id="verify-code" maxlength="24" placeholder="123456" inputmode="numeric" autocomplete="one-time-code" style="text-align:center; font-size:1.6rem; font-weight:700; letter-spacing:0.12em; width:240px; font-family:var(--mono);" required>
        </div>
        <button type="submit" class="btn-submit" id="verify-btn">Verificar</button>
        <button type="button" onclick="switchAuthTab('register')" class="ghost-link">← Volver</button>
      </form>

      <div class="guest-action-wrap">
        <a href="/" class="btn btn-ghost" style="width:100%;">Continuar como invitado →</a>
      </div>
      <div class="auth-footer">
        <a href="/terms-of-use">Términos</a>
        <span>·</span>
        <a href="/privacy-policy">Privacidad</a>
        <span>·</span>
        <span>${SITE.host}</span>
      </div>
    </div>
  </main>
  <script>
    let pendingVerifyEmail = '';
    let pendingResetEmail = '';
    if (localStorage.getItem('trujillo_ai_token')) { window.location.href = '/'; }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'forgot') { setTimeout(() => switchAuthTab('forgot'), 50); }

    function showAlert(msg, isSuccess = false) {
      const el = document.getElementById('alert-box');
      el.textContent = msg;
      el.className = 'alert-banner ' + (isSuccess ? 'alert-success' : 'alert-error');
      el.style.display = 'block';
    }
    function hideAlert() { document.getElementById('alert-box').style.display = 'none'; }
    function switchAuthTab(tab) {
      hideAlert();
      const loginForm = document.getElementById('form-login');
      const regForm = document.getElementById('form-register');
      const verifyForm = document.getElementById('form-verify');
      const forgotForm = document.getElementById('form-forgot');
      const resetForm = document.getElementById('form-reset');
      const tabsNav = document.getElementById('auth-tabs');
      document.getElementById('tab-login-btn').classList.remove('active');
      document.getElementById('tab-reg-btn').classList.remove('active');
      loginForm.style.display = 'none';
      regForm.style.display = 'none';
      verifyForm.style.display = 'none';
      forgotForm.style.display = 'none';
      resetForm.style.display = 'none';
      if (tab === 'login') { loginForm.style.display = 'flex'; tabsNav.style.display = 'grid'; document.getElementById('tab-login-btn').classList.add('active'); }
      else if (tab === 'register') { regForm.style.display = 'flex'; tabsNav.style.display = 'grid'; document.getElementById('tab-reg-btn').classList.add('active'); }
      else if (tab === 'verify') { verifyForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
      else if (tab === 'forgot') { forgotForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
      else if (tab === 'reset') { resetForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
    }
    async function handleLoginSubmit(e) {
      e.preventDefault(); hideAlert();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;
      const btn = document.getElementById('login-btn');
      btn.disabled = true; btn.textContent = 'Entrando...';
      try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
        localStorage.setItem('trujillo_ai_token', data.token);
        localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
        showAlert('Listo. Entrando al workspace...', true);
        setTimeout(() => { window.location.href = '/'; }, 400);
      } catch (err) { showAlert(err.message); btn.disabled = false; btn.textContent = 'Continuar'; }
    }
    async function handleForgotSubmit(e) {
      e.preventDefault(); hideAlert();
      const email = document.getElementById('forgot-email').value.trim().toLowerCase();
      const btn = document.getElementById('forgot-btn');
      btn.disabled = true; btn.textContent = 'Enviando...';
      try {
        const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al enviar código');
        pendingResetEmail = email;
        const resetEmailEl = document.getElementById('reset-email');
        if (resetEmailEl) resetEmailEl.value = email;
        switchAuthTab('reset');
        showAlert('Código enviado a ' + email + '.', true);
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Enviar código'; }
    }
    async function handleResetSubmit(e) {
      e.preventDefault(); hideAlert();
      const email = (document.getElementById('reset-email')?.value || pendingResetEmail || '').trim().toLowerCase();
      const code = document.getElementById('reset-code').value.trim();
      const newPassword = document.getElementById('reset-new-password').value;
      const btn = document.getElementById('reset-btn');
      if (!email || !email.includes('@')) return showAlert('Introduce tu correo.');
      if (!code || code.length !== 6) return showAlert('Introduce el código de 6 dígitos.');
      if (newPassword.length < 6) return showAlert('Mínimo 6 caracteres.');
      btn.disabled = true; btn.textContent = 'Guardando...';
      try {
        const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, newPassword }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Código incorrecto o expirado');
        localStorage.setItem('trujillo_ai_token', data.token);
        localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
        showAlert('Contraseña actualizada. Entrando...', true);
        setTimeout(() => { window.location.href = '/'; }, 400);
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Guardar y entrar'; }
    }
    async function handleRegisterSubmit(e) {
      e.preventDefault(); hideAlert();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim().toLowerCase();
      const password = document.getElementById('reg-password').value;
      const btn = document.getElementById('reg-btn');
      btn.disabled = true; btn.textContent = 'Creando...';
      try {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar');
        pendingVerifyEmail = email;
        document.getElementById('verify-email-display').textContent = email;
        switchAuthTab('verify');
        showAlert('Código enviado a ' + email + '.', true);
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Crear cuenta'; }
    }
    async function handleVerifySubmit(e) {
      e.preventDefault(); hideAlert();
      const code = document.getElementById('verify-code').value.trim();
      const btn = document.getElementById('verify-btn');
      if (!code || code.length !== 6) return showAlert('Introduce el código de 6 dígitos.');
      btn.disabled = true; btn.textContent = 'Validando...';
      try {
        const res = await fetch('/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pendingVerifyEmail, code }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Código incorrecto');
        localStorage.setItem('trujillo_ai_token', data.token);
        localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
        showAlert('Cuenta activa. Entrando...', true);
        setTimeout(() => { window.location.href = '/'; }, 400);
      } catch (err) { showAlert(err.message); btn.disabled = false; btn.textContent = 'Verificar'; }
    }
  </script>
</body>
</html>`;
}
