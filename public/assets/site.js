(function () {
  var page = document.documentElement.getAttribute('data-page') || 'about';
  var root = document.getElementById('app');
  if (!root) return;
  function t(k) { return (window.TA && TA.t) ? TA.t(k) : k; }

  function nav(active) {
    function item(href, label, key) {
      return '<a href="' + href + '"' + (active === key ? ' class="active"' : '') + '>' + label + '</a>';
    }
    return '<nav class="site-nav" aria-label="Principal"><div class="site-nav-inner">' +
      '<a class="brand" href="/"><img src="/avatar.png" width="28" height="28" alt="Trujillo AI"><span>Trujillo AI</span></a>' +
      '<div class="nav-links">' +
      item('/', t('navChat'), 'chat') +
      item('/features', t('navFeatures'), 'features') +
      item('/models', t('navModels'), 'models') +
      item('/docs', t('docsLink'), 'docs') +
      item('/about', t('navAbout'), 'about') +
      '</div>' +
      '<div class="nav-cta"><a class="btn btn-ghost" href="/login">' + t('access') + '</a><a class="btn btn-white" href="/">' + t('navStart') + '</a></div>' +
      '</div></nav>';
  }

  function langSelectHtml() {
    return '<div style="margin-top:16px"><label style="font-size:0.75rem;color:var(--dim)">' + t('language') + '</label><div id="site-lang" class="lang-picker open-down" style="margin-top:6px;max-width:260px"></div></div>';
  }

  function footer() {
    return '<footer class="site-footer"><div class="footer-grid">' +
      '<div><div class="footer-brand">Trujillo AI</div><p>' + t('footerBlurb') + '</p>' + langSelectHtml() + '</div>' +
      '<div><div class="section-label">' + t('footerProduct') + '</div><a href="/">' + t('navChat') + '</a><a href="/features">' + t('navFeatures') + '</a><a href="/models">' + t('navModels') + '</a><a href="/docs">' + t('docsLink') + '</a></div>' +
      '<div><div class="section-label">' + t('footerCompany') + '</div><a href="/about">' + t('navAbout') + '</a><a href="https://trujillomingorance.com">trujillomingorance.com</a><a href="https://github.com/atrumin16">GitHub</a><a href="mailto:alberto@trujillomingorance.com">alberto@trujillomingorance.com</a></div>' +
      '<div><div class="section-label">' + t('footerLegal') + '</div><a href="/terms-of-use">' + t('footerLegal') + '</a><a href="/privacy-policy">' + t('privacy') + '</a><a href="/llms.txt">llms.txt</a><a href="/sitemap.xml">Sitemap</a></div>' +
      '</div></footer>';
  }

  function card(title, html) {
    return '<section class="card legal-card"><h2>' + title + '</h2>' + html + '</section>';
  }

  function viewAbout() {
    return nav('about') +
      '<header class="hero wrap"><p class="kicker">' + t('aboutKicker') + '</p><h1>' + t('aboutH1') + '</h1>' +
      '<p class="lede">' + t('aboutLede') + '</p></header>' +
      '<main class="wrap"><div class="grid-2">' +
      '<article class="card"><h3>' + t('aboutProductH') + '</h3><p>' + t('aboutProductP') + '</p></article>' +
      '<article class="card"><h3>' + t('aboutFounderH') + '</h3><p>Alberto Trujillo Mingorance. <a href="mailto:alberto@trujillomingorance.com">alberto@trujillomingorance.com</a>.</p></article>' +
      '</div><article class="prose"><h2>' + t('aboutPrinciplesH') + '</h2><ul>' +
      '<li>' + t('aboutP1') + '</li><li>' + t('aboutP2') + '</li><li>' + t('aboutP3') + '</li><li>' + t('aboutP4') + '</li></ul>' +
      '<h2>' + t('aboutStackH') + '</h2><p>' + t('aboutStackP') + '</p></article></main>' + footer();
  }
  function viewFeatures() {
    return nav('features') +
      '<header class="hero wrap"><p class="kicker">' + t('featKicker') + '</p><h1>' + t('featH1') + '</h1>' +
      '<p class="lede">' + t('featLede') + '</p></header>' +
      '<main class="wrap"><div class="grid-3">' +
      '<article class="card"><h3>' + t('docsChatH') + '</h3><p>' + t('docsChatP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsProjectsH') + '</h3><p>' + t('docsProjectsP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsFilesH') + '</h3><p>' + t('docsFilesP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsComposerH') + '</h3><p>' + t('docsSearchP') + ' ' + t('docsImageP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsAccountH') + '</h3><p>' + t('docsAccountP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsMailH') + '</h3><p>' + t('docsMailP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsLangH') + '</h3><p>' + t('docsLangP') + '</p></article>' +
      '<article class="card"><h3>' + t('docsKeysH') + '</h3><p>' + t('docsKeysP') + '</p></article>' +
      '<article class="card"><h3>BYOK</h3><p>' + t('byokHint') + '</p></article>' +
      '</div></main>' + footer();
  }
  function viewModels() {
    return nav('models') +
      '<header class="hero wrap"><p class="kicker">' + t('modKicker') + '</p><h1>' + t('modH1') + '</h1>' +
      '<p class="lede">' + t('modLede') + '</p></header>' +
      '<main class="wrap"><div class="grid-2">' +
      '<article class="card"><h3>GPT OSS 120B</h3><p>' + t('m120') + '</p></article>' +
      '<article class="card"><h3>Qwen 3.6 27B</h3><p>' + t('m27') + '</p></article>' +
      '<article class="card"><h3>GPT OSS 20B</h3><p>' + t('m20') + '</p></article>' +
      '<article class="card"><h3>Compound</h3><p>' + t('mComp') + '</p></article>' +
      '</div></main>' + footer();
  }
  function viewDocs() {
    return nav('docs') +
      '<header class="hero wrap"><p class="kicker">' + t('docsKicker') + '</p><h1>' + t('docsH1') + '</h1>' +
      '<p class="lede">' + t('docsLede') + '</p></header>' +
      '<main class="wrap prose">' +
      '<h2>' + t('docsStartH') + '</h2><ol><li>' + t('docsStart1') + '</li><li>' + t('docsStart2') + '</li><li>' + t('docsStart3') + '</li></ol>' +
      '<h2>' + t('docsChatH') + '</h2><p>' + t('docsChatP') + '</p>' +
      '<h2>' + t('docsProjectsH') + '</h2><p>' + t('docsProjectsP') + '</p>' +
      '<h2>' + t('docsFilesH') + '</h2><p>' + t('docsFilesP') + '</p>' +
      '<h2>' + t('docsComposerH') + '</h2><ul>' +
      '<li>' + t('docsSearchP') + '</li><li>' + t('docsImageP') + '</li><li>' + t('docsAttachP') + '</li><li>' + t('docsDictateP') + '</li><li>' + t('docsLenP') + '</li></ul>' +
      '<h2>' + t('docsAccountH') + '</h2><p>' + t('docsAccountP') + '</p>' +
      '<h2>' + t('docsMailH') + '</h2><p>' + t('docsMailP') + '</p>' +
      '<h2>' + t('docsLangH') + '</h2><p>' + t('docsLangP') + '</p>' +
      '<h2>' + t('docsKeysH') + '</h2><p>' + t('docsKeysP') + '</p>' +
      '<h2>' + t('docsLegalH') + '</h2><p>' + t('docsLegalP') + ' <a href="/terms-of-use">' + t('footerLegal') + '</a> · <a href="/privacy-policy">' + t('privacy') + '</a>.</p>' +
      '</main>' + footer();
  }

  function viewTerms() {
    return nav('') +
      '<main class="wrap legal-wrap"><p class="kicker">' + t('footerLegal') + '</p><h1 class="page-title">Términos de Servicio</h1>' +
      '<p class="lede">Versión 2026.2 · ai.trujillomingorance.com</p><article class="prose" style="margin:0 0 64px">' +
      card('1. Aceptación y ámbito', '<p>Al usar <strong>Trujillo AI</strong> en <a href="https://ai.trujillomingorance.com">ai.trujillomingorance.com</a> o el bot de Discord asociado, aceptas estos términos.</p>') +
      card('2. El servicio', '<p>Trujillo AI ofrece chat con modelos abiertos de alta capacidad (GPT OSS, Qwen, Groq Compound), documentos, proyectos, búsqueda web, cotizaciones y generación visual Flux 1.1 Ultra sobre Cloudflare Edge y Groq LPU.</p><p>El servicio está pensado para ingeniería, análisis, escritura y trabajo técnico. No es asesoramiento legal, médico ni de inversión vinculante.</p>') +
      card('3. Propiedad y uso', '<ul><li><strong>Tuyo:</strong> prompts, código, documentos y resultados que generes.</li><li><strong>Prohibido:</strong> malware, ataques, scraping abusivo o cualquier uso ilegal.</li><li><strong>Verificación:</strong> el usuario debe revisar el código y los datos antes de usarlos en producción.</li></ul>') +
      card('4. Cuentas y acceso', '<p>Puedes entrar con correo, Google o X. Eres responsable de tu cuenta y de las sesiones que abras.</p>') +
      card('5. Claves API (BYOK)', '<p>Si configuras una clave Groq, se guarda <strong>solo en tu navegador</strong> (<code>localStorage</code>) y viaja cifrada por TLS. No se persiste en bases de datos del servidor.</p>') +
      card('6. Disponibilidad', '<p>La plataforma corre en el edge global. Podemos cambiar modelos, cuotas o defensas de tráfico para mantener el clúster estable.</p>') +
      '</article></main>' + footer();
  }
  function viewPrivacy() {
    return nav('') +
      '<main class="wrap legal-wrap"><p class="kicker">' + t('privacy') + '</p><h1 class="page-title">Política de Privacidad</h1>' +
      '<p class="lede">Versión 2026.2 · ai.trujillomingorance.com</p><article class="prose" style="margin:0 0 64px">' +
      card('1. Sin venta de datos', '<ul><li>No vendemos ni monetizamos prompts, documentos ni resultados.</li><li>No usamos tus entradas para entrenar modelos públicos.</li></ul>') +
      card('2. Inferencia efímera', '<p>El chat se procesa en memoria mediante streaming cifrado (SSE + TLS 1.3). No indexamos el contenido de las sesiones de inferencia en servidores intermedios.</p>') +
      card('3. Documentos y proyectos', '<p>Historial, proyectos y documentos se guardan de forma local en tu navegador, salvo que una función concreta (cuenta, chat compartido) requiera KV de Cloudflare. Puedes borrar la memoria en cualquier momento.</p>') +
      card('4. Cuentas y correo', '<ul><li>Las contraseñas se almacenan con hash y sal.</li><li>Puedes entrar con Google o X. En ese caso guardamos el identificador de la cuenta, el nombre y el avatar que nos envía el proveedor.</li><li>El correo transaccional sale desde <code>no-reply@trujillomingorance.com</code> sin trackers publicitarios.</li></ul>') +
      card('5. GDPR', '<p>Acceso, rectificación o borrado: <strong>alberto@trujillomingorance.com</strong>.</p>') +
      '</article></main>' + footer();
  }
  function view404() {
    return nav('') +
      '<main class="nf"><div><div class="nf-code">404</div><h1 style="margin:8px 0 12px;font-size:1.6rem">' + t('nfTitle') + '</h1>' +
      '<p style="color:var(--muted);max-width:420px;margin:0 auto 24px">' + t('nfBody') + '</p>' +
      '<div class="hero-actions"><a class="btn btn-white" href="/">' + t('nfHome') + '</a><a class="btn btn-ghost" href="/docs">' + t('docsLink') + '</a></div></div></main>' +
      footer();
  }

  function authMarkup(initialTab) {
    return '<nav class="site-nav" aria-label="Principal"><div class="site-nav-inner">' +
      '<a class="brand" href="/"><img src="/avatar.png" width="28" height="28" alt="Trujillo AI"><span>Trujillo AI</span></a>' +
      '<div class="nav-cta"><a class="btn btn-ghost" href="/docs">' + t('docsLink') + '</a><a class="btn btn-white" href="/">' + t('navChat') + '</a></div>' +
      '</div></nav>' +
      '<main class="auth-shell"><div class="auth-card">' +
      '<div class="auth-brand"><img src="/avatar.png" alt="Trujillo AI"><h1>Trujillo AI</h1>' +
      '<p>' + t('authLede') + '</p></div>' +
      '<div id="alert-box" class="alert-banner alert-error"></div>' +
      '<div class="tabs-nav" id="auth-tabs">' +
      '<button class="tab-btn' + (initialTab === 'login' ? ' active' : '') + '" id="tab-login-btn" type="button">' + t('signIn') + '</button>' +
      '<button class="tab-btn' + (initialTab === 'register' ? ' active' : '') + '" id="tab-reg-btn" type="button">' + t('register') + '</button>' +
      '</div>' +
      '<div id="auth-social">' +
      '<div class="auth-social-grid">' +
      '<div class="btn-social-google-wrap">' +
      '<button type="button" class="btn-social" id="btn-google">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>' +
      '<span>' + t('continueGoogle') + '</span></button>' +
      '<div id="google-btn-overlay" class="google-btn-overlay"></div></div>' +
      '<button type="button" class="btn-social" id="btn-x">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
      '<span>' + t('continueX') + '</span></button>' +
      '</div>' +
      '<div class="auth-divider"><span>' + t('orEmail') + '</span></div>' +
      '</div>' +
      '<form id="form-login" class="flex-col" style="display:' + (initialTab === 'login' ? 'flex' : 'none') + '">' +
      '<div class="field-group"><label class="field-label">Correo</label><input type="email" class="field-input" id="login-email" placeholder="tu@correo.com" required autocomplete="email"></div>' +
      '<div class="field-group"><div style="display:flex;justify-content:space-between;align-items:center"><label class="field-label">Contraseña</label>' +
      '<button type="button" id="forgot-link" class="ghost-link">¿Olvidaste la contraseña?</button></div>' +
      '<input type="password" class="field-input" id="login-password" placeholder="••••••••" required autocomplete="current-password"></div>' +
      '<button type="submit" class="btn-submit" id="login-btn">Continuar</button></form>' +
      '<form id="form-forgot" class="flex-col" style="display:none">' +
      '<div style="text-align:center"><div style="font-weight:650;color:#fff">Recuperar contraseña</div><p style="font-size:0.84rem;color:var(--muted);margin-top:4px">Te enviamos un código de 6 dígitos.</p></div>' +
      '<div class="field-group"><label class="field-label">Correo</label><input type="email" class="field-input" id="forgot-email" placeholder="tu@correo.com" required autocomplete="email"></div>' +
      '<input type="text" class="hp-field" id="forgot-website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button type="submit" class="btn-submit" id="forgot-btn">Enviar código</button>' +
      '<button type="button" class="ghost-link" data-tab="login">← Volver</button></form>' +
      '<form id="form-reset" class="flex-col" style="display:none">' +
      '<div style="text-align:center"><div style="font-weight:650;color:#fff">Nueva contraseña</div><p style="font-size:0.84rem;color:var(--muted);margin-top:4px">Código de 6 dígitos y la contraseña nueva.</p></div>' +
      '<div class="field-group"><label class="field-label">Correo</label><input type="email" class="field-input" id="reset-email" placeholder="tu@correo.com" required autocomplete="email"></div>' +
      '<div class="field-group"><label class="field-label">Código</label><input type="text" class="field-input" id="reset-code" maxlength="24" placeholder="123456" inputmode="numeric" autocomplete="one-time-code" style="text-align:center;font-size:1.5rem;font-weight:700;font-family:var(--mono);letter-spacing:0.12em" required></div>' +
      '<div class="field-group"><label class="field-label">Nueva contraseña (mín. 6)</label><input type="password" class="field-input" id="reset-new-password" placeholder="••••••••" minlength="6" required autocomplete="new-password"></div>' +
      '<button type="submit" class="btn-submit" id="reset-btn">Guardar y entrar</button>' +
      '<button type="button" class="ghost-link" data-tab="forgot">← Otro código</button></form>' +
      '<form id="form-register" class="flex-col" style="display:' + (initialTab === 'register' ? 'flex' : 'none') + '">' +
      '<div class="field-group"><label class="field-label">Nombre</label><input type="text" class="field-input" id="reg-name" placeholder="Tu nombre" required autocomplete="name"></div>' +
      '<div class="field-group"><label class="field-label">Correo</label><input type="email" class="field-input" id="reg-email" placeholder="tu@correo.com" required autocomplete="email"></div>' +
      '<div class="field-group"><label class="field-label">Contraseña (mín. 6)</label><input type="password" class="field-input" id="reg-password" placeholder="••••••••" minlength="6" required autocomplete="new-password"></div>' +
      '<input type="text" class="hp-field" id="reg-website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button type="submit" class="btn-submit" id="reg-btn">Crear cuenta</button></form>' +
      '<form id="form-mail-confirm" class="flex-col" style="display:none;text-align:center">' +
      '<p style="font-size:0.9rem;color:#fff;font-weight:650">Confirma que eres una persona</p>' +
      '<p style="font-size:0.84rem;color:var(--muted);margin:8px 0 14px">Los bots no pueden enviar correo. Pulsa el botón para mandar el mensaje a <strong id="mail-confirm-email" style="color:#fff"></strong>.</p>' +
      '<input type="text" class="hp-field" id="mail-website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<label style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:0.84rem;margin-bottom:12px"><input type="checkbox" id="mail-human"> Soy una persona</label>' +
      '<button type="submit" class="btn-submit" id="mail-confirm-btn" disabled>Enviar el correo ahora</button>' +
      '<button type="button" class="ghost-link" data-tab="login">← Volver</button></form>' +
      '<form id="form-verify" class="flex-col" style="display:none;text-align:center">' +
      '<p style="font-size:0.86rem;color:var(--muted)">Código enviado a <strong id="verify-email-display" style="color:#fff"></strong></p>' +
      '<div class="field-group" style="align-items:center"><input type="text" class="field-input" id="verify-code" maxlength="24" placeholder="123456" inputmode="numeric" autocomplete="one-time-code" style="text-align:center;font-size:1.6rem;font-weight:700;font-family:var(--mono);letter-spacing:0.12em;width:240px" required></div>' +
      '<button type="submit" class="btn-submit" id="verify-btn">Verificar</button>' +
      '<button type="button" class="ghost-link" data-tab="register">← Volver</button></form>' +
      '<div class="guest-action-wrap"><a href="/" class="btn btn-ghost" style="width:100%">' + t('guestContinue') + ' →</a></div>' +
      '<div class="auth-footer"><a href="/terms-of-use">Términos</a><span>·</span><a href="/privacy-policy">Privacidad</a><span>·</span><span>ai.trujillomingorance.com</span></div>' +
      '</div></main>';
  }

  function bindSiteLang() {
    if (window.TA && TA.mountPicker) TA.mountPicker(document.getElementById('site-lang'));
  }
  function renderSite() {
    var map = { about: viewAbout, features: viewFeatures, models: viewModels, docs: viewDocs, terms: viewTerms, privacy: viewPrivacy, '404': view404, login: function () { return authMarkup('login'); }, register: function () { return authMarkup('register'); } };
    var fn = map[page] || view404;
    root.innerHTML = fn();
    bindSiteLang();
    if (page === 'login' || page === 'register') initAuth(page);
  }
  window.TA_applyI18n = renderSite;
  renderSite();

  function initAuth(initialTab) {
    var pendingVerifyEmail = '';
    var pendingResetEmail = '';
    var pendingMailTicket = '';
    var pendingMailNext = 'verify';
    var GOOGLE_CLIENT_ID = '161745150528-5pb84k9upvamvlvnc7lg6nr1ku74vc4a.apps.googleusercontent.com';
    var X_CLIENT_ID = 'NF94WVVIT1dzSXZNaTJuYjRXSEc6MTpjaQ';
    var urlParams = new URLSearchParams(window.location.search);
    var isXCallback = urlParams.get('auth') === 'x_callback' || (urlParams.get('state') || '').indexOf('x_oauth_') === 0;
    if (!isXCallback && localStorage.getItem('trujillo_ai_token')) {
      window.location.href = '/';
      return;
    }
    if (urlParams.get('tab') === 'forgot') switchAuthTab('forgot');
    if (urlParams.get('tab') === 'reset') {
      var qEmail = (urlParams.get('email') || '').trim().toLowerCase();
      if (qEmail) {
        pendingResetEmail = qEmail;
        var qEmailEl = document.getElementById('reset-email');
        if (qEmailEl) qEmailEl.value = qEmail;
      }
      switchAuthTab('reset');
    }
    function bindCodeInput(id) {
      var el = document.getElementById(id);
      if (!el) return;
      function takeDigits(raw) {
        var m = String(raw || '').match(/\d{6}/);
        return m ? m[0] : String(raw || '').replace(/\D/g, '').slice(0, 6);
      }
      function normalize() {
        var digits = takeDigits(el.value);
        if (el.value !== digits) el.value = digits;
      }
      el.addEventListener('input', normalize);
      el.addEventListener('paste', function (e) {
        var text = '';
        try { text = (e.clipboardData || window.clipboardData).getData('text') || ''; } catch (err) {}
        if (!text) return;
        e.preventDefault();
        el.value = takeDigits(text);
      });
    }
    bindCodeInput('reset-code');
    bindCodeInput('verify-code');

    function showAlert(msg, isSuccess) {
      var el = document.getElementById('alert-box');
      el.textContent = msg;
      el.className = 'alert-banner ' + (isSuccess ? 'alert-success' : 'alert-error');
      el.style.display = 'block';
    }
    function hideAlert() { document.getElementById('alert-box').style.display = 'none'; }
    function switchAuthTab(tab) {
      hideAlert();
      var loginForm = document.getElementById('form-login');
      var regForm = document.getElementById('form-register');
      var verifyForm = document.getElementById('form-verify');
      var forgotForm = document.getElementById('form-forgot');
      var resetForm = document.getElementById('form-reset');
      var mailForm = document.getElementById('form-mail-confirm');
      var tabsNav = document.getElementById('auth-tabs');
      var social = document.getElementById('auth-social');
      document.getElementById('tab-login-btn').classList.remove('active');
      document.getElementById('tab-reg-btn').classList.remove('active');
      loginForm.style.display = 'none';
      regForm.style.display = 'none';
      verifyForm.style.display = 'none';
      forgotForm.style.display = 'none';
      resetForm.style.display = 'none';
      if (mailForm) mailForm.style.display = 'none';
      if (social) social.style.display = (tab === 'login' || tab === 'register') ? 'block' : 'none';
      if (tab === 'login') { loginForm.style.display = 'flex'; tabsNav.style.display = 'grid'; document.getElementById('tab-login-btn').classList.add('active'); }
      else if (tab === 'register') { regForm.style.display = 'flex'; tabsNav.style.display = 'grid'; document.getElementById('tab-reg-btn').classList.add('active'); }
      else if (tab === 'verify') { verifyForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
      else if (tab === 'forgot') { forgotForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
      else if (tab === 'reset') { resetForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
      else if (tab === 'mailconfirm' && mailForm) { mailForm.style.display = 'flex'; tabsNav.style.display = 'none'; }
    }
    function finishLogin(data) {
      localStorage.setItem('trujillo_ai_token', data.token);
      localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
      showAlert('Listo. Entrando al workspace...', true);
      setTimeout(function () { window.location.href = '/'; }, 400);
    }
    async function postAuth(path, body) {
      var res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo entrar');
      return data;
    }
    function mountGoogle() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return false;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        ux_mode: 'popup'
      });
      var slot = document.getElementById('google-btn-overlay');
      if (slot && !slot.getAttribute('data-ready')) {
        window.google.accounts.id.renderButton(slot, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: Math.max(slot.parentElement ? slot.parentElement.offsetWidth : 320, 280),
          text: 'continue_with'
        });
        slot.setAttribute('data-ready', '1');
      }
      return true;
    }
    async function handleGoogleCredential(response) {
      hideAlert();
      try {
        var data = await postAuth('/api/auth/google', { credential: response.credential });
        finishLogin(data);
      } catch (err) { showAlert(err.message); }
    }
    window.handleGoogleCredential = handleGoogleCredential;
    (function waitGoogle() {
      if (mountGoogle()) return;
      var n = 0;
      var timer = setInterval(function () {
        n += 1;
        if (mountGoogle() || n > 40) clearInterval(timer);
      }, 150);
    })();
    function startXLogin() {
      var state = 'x_oauth_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('trujillo_x_oauth_state', state);
      var redirectUri = encodeURIComponent(window.location.origin + '/login?auth=x_callback');
      window.location.href = 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' + X_CLIENT_ID +
        '&redirect_uri=' + redirectUri + '&scope=users.read%20tweet.read&state=' + state +
        '&code_challenge=challenge&code_challenge_method=plain';
    }
    if (urlParams.get('error')) showAlert('No se completó el acceso con X.');
    if (isXCallback) {
      var code = urlParams.get('code');
      window.history.replaceState({}, document.title, window.location.pathname);
      if (code) {
        showAlert('Confirmando acceso con X...', true);
        postAuth('/api/auth/x', { code: code, redirectUri: window.location.origin + '/login?auth=x_callback' })
          .then(finishLogin)
          .catch(function (err) { showAlert(err.message); });
      }
    }

    document.getElementById('tab-login-btn').onclick = function () { switchAuthTab('login'); };
    document.getElementById('tab-reg-btn').onclick = function () { switchAuthTab('register'); };
    document.getElementById('forgot-link').onclick = function () { switchAuthTab('forgot'); };
    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.onclick = function () { switchAuthTab(btn.getAttribute('data-tab')); };
    });
    var googleBtn = document.getElementById('btn-google');
    if (googleBtn) googleBtn.onclick = function () {
      if (!mountGoogle()) showAlert('Cargando Google Sign-In. Espera un instante y vuelve a pulsar.');
      else if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt();
      }
    };
    var xBtn = document.getElementById('btn-x');
    if (xBtn) xBtn.onclick = startXLogin;

    document.getElementById('form-login').onsubmit = async function (e) {
      e.preventDefault(); hideAlert();
      var email = document.getElementById('login-email').value.trim().toLowerCase();
      var password = document.getElementById('login-password').value;
      var btn = document.getElementById('login-btn');
      btn.disabled = true; btn.textContent = 'Entrando...';
      try {
        var res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, password: password }) });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
        localStorage.setItem('trujillo_ai_token', data.token);
        localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
        showAlert('Listo. Entrando al workspace...', true);
        setTimeout(function () { window.location.href = '/'; }, 400);
      } catch (err) { showAlert(err.message); btn.disabled = false; btn.textContent = 'Continuar'; }
    };

    document.getElementById('form-forgot').onsubmit = async function (e) {
      e.preventDefault(); hideAlert();
      var email = document.getElementById('forgot-email').value.trim().toLowerCase();
      var btn = document.getElementById('forgot-btn');
      btn.disabled = true; btn.textContent = 'Enviando...';
      try {
        var hp = document.getElementById('forgot-website');
        var res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, website: hp ? hp.value : '' }) });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al enviar código');
        pendingResetEmail = email;
        var resetEmailEl = document.getElementById('reset-email');
        if (resetEmailEl) resetEmailEl.value = email;
        if (data.needsClick && data.ticket) {
          pendingMailTicket = data.ticket;
          pendingMailNext = 'reset';
          var mailEmail = document.getElementById('mail-confirm-email');
          if (mailEmail) mailEmail.textContent = email;
          switchAuthTab('mailconfirm');
          showAlert('Pulsa el botón para enviar el correo.', true);
        } else {
          switchAuthTab('reset');
          showAlert('Código enviado a ' + email + '.', true);
        }
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Enviar código'; }
    };

    document.getElementById('form-reset').onsubmit = async function (e) {
      e.preventDefault(); hideAlert();
      var email = (document.getElementById('reset-email').value || pendingResetEmail || '').trim().toLowerCase();
      var code = document.getElementById('reset-code').value.replace(/\D/g, '').slice(0, 6);
      var newPassword = document.getElementById('reset-new-password').value;
      var btn = document.getElementById('reset-btn');
      if (!email || !email.includes('@')) return showAlert('Introduce tu correo.');
      if (!code || code.length !== 6) return showAlert('Introduce el código de 6 dígitos.');
      if (newPassword.length < 6) return showAlert('Mínimo 6 caracteres.');
      btn.disabled = true; btn.textContent = 'Guardando...';
      try {
        var res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, code: code, newPassword: newPassword }) });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Código incorrecto o expirado');
        localStorage.setItem('trujillo_ai_token', data.token);
        localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
        showAlert('Contraseña actualizada. Entrando...', true);
        setTimeout(function () { window.location.href = '/'; }, 400);
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Guardar y entrar'; }
    };

    document.getElementById('form-register').onsubmit = async function (e) {
      e.preventDefault(); hideAlert();
      var name = document.getElementById('reg-name').value.trim();
      var email = document.getElementById('reg-email').value.trim().toLowerCase();
      var password = document.getElementById('reg-password').value;
      var btn = document.getElementById('reg-btn');
      btn.disabled = true; btn.textContent = 'Creando...';
      try {
        var hp = document.getElementById('reg-website');
        var res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, email: email, password: password, locale: (window.TA && TA.lang) ? TA.lang() : 'es', website: hp ? hp.value : '' }) });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar');
        pendingVerifyEmail = email;
        document.getElementById('verify-email-display').textContent = email;
        if (data.needsClick && data.ticket) {
          pendingMailTicket = data.ticket;
          pendingMailNext = 'verify';
          var mailEmail = document.getElementById('mail-confirm-email');
          if (mailEmail) mailEmail.textContent = email;
          switchAuthTab('mailconfirm');
          showAlert('Pulsa el botón para enviar el correo de verificación.', true);
        } else {
          switchAuthTab('verify');
          showAlert('Código enviado a ' + email + '.', true);
        }
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = false; btn.textContent = 'Crear cuenta'; }
    };

    document.getElementById('form-verify').onsubmit = async function (e) {
      e.preventDefault(); hideAlert();
      var code = document.getElementById('verify-code').value.replace(/\D/g, '').slice(0, 6);
      var btn = document.getElementById('verify-btn');
      if (!code || code.length !== 6) return showAlert('Introduce el código de 6 dígitos.');
      btn.disabled = true; btn.textContent = 'Validando...';
      try {
        var res = await fetch('/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pendingVerifyEmail, code: code }) });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Código incorrecto');
        localStorage.setItem('trujillo_ai_token', data.token);
        localStorage.setItem('trujillo_ai_user', JSON.stringify(data.user));
        showAlert('Cuenta activa. Entrando...', true);
        setTimeout(function () { window.location.href = '/'; }, 400);
      } catch (err) { showAlert(err.message); btn.disabled = false; btn.textContent = 'Verificar'; }
    };

    var humanBox = document.getElementById('mail-human');
    var mailBtn = document.getElementById('mail-confirm-btn');
    if (humanBox && mailBtn) {
      humanBox.addEventListener('change', function () { mailBtn.disabled = !humanBox.checked; });
    }
    var mailForm = document.getElementById('form-mail-confirm');
    if (mailForm) mailForm.onsubmit = async function (e) {
      e.preventDefault(); hideAlert();
      if (!pendingMailTicket) return showAlert('Vuelve a pedir el correo.');
      if (humanBox && !humanBox.checked) return showAlert('Marca que eres una persona.');
      var btn = document.getElementById('mail-confirm-btn');
      var hp = document.getElementById('mail-website');
      btn.disabled = true; btn.textContent = 'Enviando...';
      try {
        var res = await fetch('/api/mail/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticket: pendingMailTicket, website: hp ? hp.value : '' }) });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || 'No se pudo enviar');
        pendingMailTicket = '';
        switchAuthTab(pendingMailNext || 'verify');
        showAlert('Correo enviado. Revisa tu bandeja.', true);
      } catch (err) { showAlert(err.message); }
      finally { btn.disabled = !(humanBox && humanBox.checked); btn.textContent = 'Enviar el correo ahora'; }
    };
  }
})();
