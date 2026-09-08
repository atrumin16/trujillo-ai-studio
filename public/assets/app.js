(function() {
  var _root = document.getElementById('app');
  if (_root) _root.innerHTML = "<div class=\"ta-app\">\n<div class=\"ta-app\">\n  <div class=\"sidebar-overlay\" id=\"sidebar-overlay\"></div>\n  <aside class=\"ta-sidebar\" id=\"sidebar\">\n    <div class=\"sb-head\">\n      <a href=\"/\" class=\"brand-logo\">\n        <img src=\"/avatar.png\" alt=\"Trujillo AI\" class=\"brand-avatar\">\n        <span class=\"brand-title\">Trujillo AI</span>\n      </a>\n      <button id=\"sidebar-close-btn\" class=\"icon-btn\" title=\"Cerrar\" style=\"display:none\">✕</button>\n    </div>\n    <button id=\"new-chat-btn\" class=\"new-chat-btn\" type=\"button\">\n      <span>+ <span data-i18n=\"newChat\">Nueva conversación</span></span>\n      <span class=\"hint\">⌘K</span>\n    </button>\n    <button id=\"temp-chat-btn\" class=\"new-chat-btn ghost\" type=\"button\">\n      <span data-i18n=\"tempChat\">Chat temporal</span>\n      <span class=\"hint\">⌘⇧N</span>\n    </button>\n    <div class=\"history-search-box\">\n      <input type=\"search\" id=\"history-search\" class=\"history-search-input\" placeholder=\"Buscar…\" autocomplete=\"off\" data-i18n=\"searchPh\" data-i18n-attr=\"placeholder\">\n    </div>\n    <div class=\"sb-tabs\">\n      <button type=\"button\" class=\"sb-tab active\" data-view=\"chats\" id=\"tab-chats\" data-i18n=\"chats\">Chats</button>\n      <button type=\"button\" class=\"sb-tab\" data-view=\"projects\" id=\"tab-projects\" data-i18n=\"projects\">Proyectos</button>\n      <button type=\"button\" class=\"sb-tab\" data-view=\"docs\" id=\"tab-docs\" data-i18n=\"docs\">Documentos</button>\n    </div>\n    <div class=\"history-list\" id=\"history-list\"></div>\n    <div class=\"sb-foot\">\n      <a href=\"https://rewrite.trujillomingorance.com\" target=\"_blank\" rel=\"noopener\" class=\"sb-link\" style=\"display:flex;align-items:center;justify-content:space-between;text-decoration:none;\">\n        <span style=\"display:flex;align-items:center;gap:7px;\">\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/></svg>\n          <span>Rewrite AI (0% IA)</span>\n        </span>\n        <span style=\"font-size:0.62rem;background:rgba(56,189,248,0.15);color:var(--blue);padding:1px 6px;border-radius:4px;font-weight:700;\">NUEVO</span>\n      </a>\n      <button type=\"button\" id=\"open-connectors-btn\" class=\"sb-link\" data-i18n=\"connectors\">Conectores</button>\n      <button type=\"button\" id=\"open-settings-btn\" class=\"sb-link\" data-i18n=\"settings\" data-open-settings=\"pane-general\">Ajustes</button>\n      <a href=\"/docs\" class=\"sb-link\" data-i18n=\"docsLink\">Documentación</a>\n      <div id=\"lang-select\" class=\"lang-picker\" aria-label=\"Language\"></div>\n      <button type=\"button\" class=\"user-pill\" id=\"user-profile-pill\" data-open-settings=\"pane-account\">\n        <div style=\"display:flex;align-items:center;gap:8px;min-width:0\">\n          <div class=\"avatar-letter\" id=\"user-letter\">T</div>\n          <div style=\"min-width:0\">\n            <div class=\"user-info-name\" id=\"user-display-name\">Invitado</div>\n            <div class=\"user-info-tier\" id=\"user-display-tier\">50K tokens / día</div>\n          </div>\n        </div>\n      </button>\n    </div>\n  </aside>\n\n  <main class=\"ta-main\">\n    <header class=\"ta-topbar\">\n      <div class=\"topbar-left\">\n        <button id=\"sidebar-toggle-btn\" class=\"icon-btn menu-toggle-btn\" type=\"button\" title=\"Menú\" aria-label=\"Menú\">\n          <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"/><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"/></svg>\n        </button>\n        <div class=\"model-picker\" id=\"model-picker\">\n          <button type=\"button\" class=\"model-picker-btn\" id=\"model-picker-btn\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n            <span class=\"model-picker-label\" id=\"model-picker-label\">GPT OSS 120B</span>\n            <svg class=\"model-picker-caret\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>\n          </button>\n          <div class=\"model-menu\" id=\"model-menu\" role=\"listbox\"></div>\n        </div>\n      </div>\n      <div class=\"topbar-right\">\n        <span id=\"temp-badge\" class=\"temp-badge\" data-i18n=\"tempOn\">Temporal</span>\n        <button id=\"cmd-open-btn\" class=\"topbar-icon-btn\" type=\"button\" title=\"Ctrl+P\" data-i18n=\"commandPalette\" data-i18n-attr=\"title\" aria-label=\"Comandos\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/></svg>\n        </button>\n        <button id=\"export-chat-btn\" class=\"topbar-icon-btn\" type=\"button\" data-i18n=\"exportChat\" data-i18n-attr=\"title\" aria-label=\"Exportar\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3v12\"/><path d=\"M8 11l4 4 4-4\"/><path d=\"M5 21h14\"/></svg>\n        </button>\n        <button id=\"open-share-btn\" class=\"topbar-icon-btn\" type=\"button\" data-i18n=\"share\" data-i18n-attr=\"title\" aria-label=\"Compartir\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><path d=\"M8.6 13.5l6.8 4\"/><path d=\"M15.4 6.5l-6.8 4\"/></svg>\n        </button>\n        <button id=\"topbar-auth-btn\" class=\"topbar-action-btn primary\" type=\"button\" data-open-settings=\"pane-account\">\n          <span class=\"avatar-letter\" id=\"topbar-letter\" hidden>T</span>\n          <span id=\"topbar-auth-text\">Acceder</span>\n        </button>\n      </div>\n    </header>\n    <div class=\"ta-chat-scroll\" id=\"chat-scroll\">\n      <div class=\"ta-chat-wrap\" id=\"chat-container\"></div>\n    </div>\n    <footer class=\"ta-input-dock\">\n      <div class=\"capsule-box\">\n        <div id=\"attached-badge\" class=\"file-badge-preview\">\n          <img id=\"attached-thumb\" alt=\"\" hidden>\n          <span id=\"attached-kind\">Documento</span>\n          <span id=\"attached-name\">documento.txt</span>\n          <button id=\"remove-file-btn\" type=\"button\" style=\"background:none;border:none;color:var(--dim);cursor:pointer\">✕</button>\n        </div>\n        <textarea id=\"prompt-input\" class=\"prompt-textarea\" rows=\"1\" placeholder=\"Pregunta lo que quieras…\" data-i18n=\"askPh\" data-i18n-attr=\"placeholder\"></textarea>\n        <div class=\"dock-controls\">\n          <div class=\"control-pills\">\n            <button id=\"web-search-pill\" class=\"dock-pill\" type=\"button\" data-i18n=\"searchWeb\">Buscar</button>\n            <button id=\"image-gen-pill\" class=\"dock-pill\" type=\"button\" data-i18n=\"image\">Imagen</button>\n            <button id=\"quick-connectors-pill\" class=\"dock-pill\" type=\"button\" data-i18n=\"connectors\">Conectores</button>\n            <div class=\"length-segmented-pill\" style=\"display:none;\" title=\"Longitud\"><button class=\"length-opt-btn active\" data-len=\"normal\" id=\"len-btn-normal\" type=\"button\" data-i18n=\"normal\">Normal</button></div>\n          </div>\n          <div class=\"dock-action-buttons\">\n            <input type=\"file\" id=\"file-uploader\" style=\"display:none\" accept=\"image/jpeg,image/png,image/webp,image/gif,.txt,.md,.json,.js,.ts,.py,.csv,.log,.html,.css\">\n            <button id=\"attach-file-btn\" class=\"dock-btn\" type=\"button\" title=\"Adjuntar archivo o imagen\" aria-label=\"Adjuntar\" data-i18n=\"attach\" data-i18n-attr=\"title\">\n              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"/></svg>\n            </button>\n            <button id=\"mic-btn\" class=\"dock-btn\" type=\"button\" title=\"Grabar voz\" aria-label=\"Grabar voz\" data-i18n=\"dictate\" data-i18n-attr=\"title\">\n              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"2\" width=\"6\" height=\"12\" rx=\"3\"/><path d=\"M5 11a7 7 0 0 0 14 0\"/><path d=\"M12 18v4\"/><path d=\"M8 22h8\"/></svg>\n            </button>\n            <button id=\"speak-last-btn\" class=\"dock-btn\" type=\"button\" title=\"Leer respuesta\" aria-label=\"Leer\" data-i18n=\"speakLast\" data-i18n-attr=\"title\">\n              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 5L6 9H3v6h3l5 4V5z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7\"/><path d=\"M18.5 6a8.5 8.5 0 0 1 0 12\"/></svg>\n            </button>\n            <button id=\"send-btn\" class=\"send-submit-btn\" type=\"button\" title=\"Enviar\">\n              <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"><path d=\"M12 19V5M5 12l7-7 7 7\"/></svg>\n            </button>\n          </div>\n        </div>\n      </div>\n      <p class=\"disclaimer\"><span data-i18n=\"disclaimer\">Trujillo AI puede equivocarse.</span> <a href=\"/docs\" data-i18n=\"docsLink\">Documentación</a> · <a href=\"/privacy-policy\" data-i18n=\"privacy\">Privacidad</a> · <button type=\"button\" id=\"open-ideas-btn\" class=\"linkish\" data-i18n=\"ideas\" style=\"background:none;border:0;color:inherit;cursor:pointer;text-decoration:underline;font:inherit;padding:0\">Sugerir una función</button></p>\n    </footer>\n  </main>\n\n  <aside class=\"art-panel\" id=\"art-panel\" aria-label=\"Artefacto\">\n    <div class=\"art-head\">\n      <div class=\"art-title\" id=\"art-title\">Artefacto</div>\n      <div style=\"display:flex;gap:6px\">\n        <button type=\"button\" class=\"topbar-action-btn\" id=\"art-copy-btn\">Copiar</button>\n        <button type=\"button\" class=\"topbar-action-btn\" id=\"art-save-btn\">Guardar</button>\n        <button type=\"button\" class=\"icon-btn\" id=\"art-close-btn\">✕</button>\n      </div>\n    </div>\n    <pre class=\"art-body\" id=\"art-body\"></pre>\n  </aside>\n</div>\n\n<div class=\"modal-backdrop\" id=\"modal-connectors\">\n  <div class=\"modal-card\" style=\"max-width: 600px;\">\n    <div class=\"modal-header\"><div class=\"modal-title\">Conectores Profesionales</div><button class=\"modal-close-btn\" data-modal=\"modal-connectors\" type=\"button\">✕</button></div>\n    <div class=\"modal-body\">\n      \n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"/><polyline points=\"21 15 16 10 5 21\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Imagen Flux 1.1 Ultra</div><div class=\"connector-desc\">Generación hiperrealista 1024×1024</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-img\">\n      </div>\n      \n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Búsqueda Web en Tiempo Real</div><div class=\"connector-desc\">Indexación de noticias y fuentes actuales</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-web\">\n      </div>\n      \n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Cotizaciones de Mercado</div><div class=\"connector-desc\">Acciones, ETFs y Cripto (ej. $BTC, $TSLA)</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-market\">\n      </div>\n      \n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"/><polyline points=\"10 9 9 9 8 9\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Documentos / RAG</div><div class=\"connector-desc\">Memoria corporativa del workspace</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-rag\">\n      </div>\n\n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Automatización N8N / Make</div><div class=\"connector-desc\">Ejecución de flujos y tareas en background</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-n8n\">\n      </div>\n      \n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"/><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"/><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Ejecución de Código Sandbox</div><div class=\"connector-desc\">Evaluación segura de Python, JS y Rust</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-code\">\n      </div>\n\n      <div class=\"connector-card\">\n        <div style=\"display:flex;align-items:center;gap:14px;\">\n          <div style=\"display:flex;flex-shrink:0;color:var(--text);\">\n            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/></svg>\n          </div>\n          <div><div class=\"connector-name\">Integración Jira / CRM</div><div class=\"connector-desc\">Búsqueda bidireccional en tickets y docs</div></div>\n        </div>\n        <input type=\"checkbox\" checked id=\"conn-jira\">\n      </div>\n\n      <div>\n        <div class=\"form-label\" style=\"margin-bottom:8px\">Webhook o API propia</div>\n        <div style=\"display:flex;gap:6px;margin-bottom:8px\">\n          <input type=\"text\" id=\"custom-conn-name\" class=\"form-input\" style=\"flex:1; min-width:0;\" placeholder=\"Nombre\">\n          <input type=\"url\" id=\"custom-conn-url\" class=\"form-input\" style=\"flex:2; min-width:0;\" placeholder=\"https://…\">\n          <button id=\"add-custom-conn-btn\" class=\"topbar-action-btn primary\" type=\"button\">Añadir</button>\n        </div>\n        <div id=\"custom-conn-list\"></div>\n      </div>\n    </div>\n    <div class=\"modal-footer\"><button class=\"topbar-action-btn modal-close-btn\" data-modal=\"modal-connectors\" type=\"button\">Listo</button></div>\n  </div>\n</div>\n\n<div class=\"modal-backdrop\" id=\"modal-settings\">\n  <div class=\"modal-card settings-wide\">\n    <div class=\"modal-header\"><div class=\"modal-title\" data-i18n=\"settings\">Ajustes</div><button class=\"modal-close-btn\" data-modal=\"modal-settings\" type=\"button\" aria-label=\"Cerrar\" data-i18n=\"close\" data-i18n-attr=\"aria-label\">✕</button></div>\n    <div class=\"settings-layout\">\n      <nav class=\"settings-nav\" aria-label=\"Ajustes\">\n        <div class=\"settings-nav-label\" data-i18n=\"navApp\">App</div>\n        <button type=\"button\" class=\"settings-nav-btn active\" data-pane=\"pane-general\" data-i18n=\"tabGeneral\">General</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-account\" data-i18n=\"tabAccount\">Cuenta</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-appearance\" data-i18n=\"tabAppearance\">Apariencia</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-behavior\" data-i18n=\"tabBehavior\">Comportamiento</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-customize\" data-i18n=\"tabCustomize\">Personalizar</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-integrations\">Integraciones</button>\n        <div class=\"settings-nav-label\" data-i18n=\"navBilling\">Plan</div>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-plan\" data-i18n=\"tabPlan\">Plan y facturación</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-usage\" data-i18n=\"tabUsage\">Uso</button>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-ideas\" data-i18n=\"ideas\">Ideas</button>\n        <div class=\"settings-nav-label\" data-i18n=\"navData\">Datos</div>\n        <button type=\"button\" class=\"settings-nav-btn\" data-pane=\"pane-data\" data-i18n=\"tabData\">Controles de datos</button>\n        <button type=\"button\" class=\"settings-nav-btn settings-nav-logout\" id=\"nav-logout-btn\" data-i18n=\"logout\" hidden>Cerrar sesión</button>\n      </nav>\n      <div class=\"settings-main\">\n        <div id=\"pane-general\" class=\"settings-pane active\">\n          <div class=\"settings-section-title\" data-i18n=\"tabGeneral\">General</div>\n          <p class=\"settings-section-desc\" data-i18n=\"generalDesc\">Idioma, modelo por defecto y longitud de respuesta.</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"language\">Idioma</label>\n            <div id=\"set-lang\" class=\"lang-picker open-down\"></div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"setDefaultModel\">Modelo por defecto</label>\n            <select id=\"set-default-model\" class=\"form-input\"></select>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"setDefaultLength\">Longitud por defecto</label>\n            <div class=\"choice-row\" id=\"set-default-length\">\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_len_mode\" data-value=\"corto\" data-i18n=\"short\">Corto</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_len_mode\" data-value=\"normal\" data-i18n=\"normal\">Normal</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_len_mode\" data-value=\"extendido\" data-i18n=\"long\">Largo</button>\n            </div>\n          </div>\n          <p class=\"settings-hint\">Trujillo AI · 2026.2 · ai.trujillomingorance.com</p>\n        </div>\n\n        <div id=\"pane-account\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabAccount\">Cuenta</div>\n          <p class=\"settings-section-desc\" data-i18n=\"accountDesc\">Tu perfil, plan, correos y acceso.</p>\n          <div id=\"account-guest\" style=\"display:none;text-align:center;padding:18px 8px;\">\n            <p style=\"font-size:0.84rem;color:var(--muted);margin-bottom:12px\" data-i18n=\"needLogin\">Inicia sesión para sincronizar la cuenta.</p>\n            <a href=\"/login\" class=\"topbar-action-btn primary\" style=\"text-decoration:none\" data-i18n=\"signIn\">Acceder</a>\n          </div>\n          <div id=\"account-authed\">\n            <div class=\"settings-card\">\n              <div class=\"settings-kv\">\n                <div class=\"settings-kv-label\" data-i18n=\"displayName\">Nombre</div>\n                <div class=\"settings-kv-control\">\n                  <input type=\"text\" id=\"set-display-name\" class=\"form-input\" maxlength=\"80\" autocomplete=\"name\">\n                </div>\n              </div>\n              <div class=\"settings-kv\">\n                <div class=\"settings-kv-label\" data-i18n=\"emailLabel\">Correo</div>\n                <div class=\"settings-kv-value\" id=\"account-email-display\"></div>\n              </div>\n              <div class=\"settings-kv\">\n                <div class=\"settings-kv-label\" data-i18n=\"tabPlan\">Plan y facturación</div>\n                <span class=\"plan-badge\" id=\"account-plan-badge\">FREE</span>\n              </div>\n            </div>\n\n            <div class=\"settings-block-title\" data-i18n=\"emailPrefs\">Correos</div>\n            <p class=\"settings-hint\" data-i18n=\"emailsHint\">Elige qué correos quieres recibir en tu bandeja.</p>\n            <div class=\"settings-card\">\n              <label class=\"toggle-row\"><span data-i18n=\"notifyProduct\">Novedades de producto</span><input type=\"checkbox\" id=\"set-notify-product\" checked></label>\n              <label class=\"toggle-row\"><span data-i18n=\"notifySecurity\">Alertas de seguridad</span><input type=\"checkbox\" id=\"set-notify-security\" checked></label>\n              <label class=\"toggle-row\"><span data-i18n=\"notifyDigest\">Resumen ocasional</span><input type=\"checkbox\" id=\"set-notify-digest\"></label>\n              <div class=\"settings-actions\">\n                <button type=\"button\" id=\"test-email-btn\" class=\"topbar-action-btn\" data-i18n=\"testEmail\">Enviar correo de prueba</button>\n              </div>\n            </div>\n\n            <p id=\"oauth-pass-hint\" class=\"settings-hint\" style=\"display:none;margin-top:16px\"></p>\n            <div id=\"password-fields\">\n              <div class=\"settings-block-title\" data-i18n=\"passwordSection\">Contraseña</div>\n              <div class=\"settings-card\">\n                <div class=\"form-group\">\n                  <label class=\"form-label\" data-i18n=\"currentPassword\">Contraseña actual</label>\n                  <input type=\"password\" id=\"set-cur-pass\" class=\"form-input\" autocomplete=\"current-password\">\n                </div>\n                <div class=\"form-group\">\n                  <label class=\"form-label\" data-i18n=\"newPassword\">Nueva contraseña</label>\n                  <input type=\"password\" id=\"set-new-pass\" class=\"form-input\" autocomplete=\"new-password\" minlength=\"6\">\n                </div>\n                <div class=\"settings-actions\">\n                  <button type=\"button\" id=\"change-pass-btn\" class=\"topbar-action-btn primary\" data-i18n=\"changePassword\">Cambiar contraseña</button>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"settings-block-title\" data-i18n=\"sessionTitle\">Sesión</div>\n            <div class=\"settings-card\" style=\"padding:16px\">\n              <div class=\"settings-kv-label\" data-i18n=\"logout\">Cerrar sesión</div>\n              <p class=\"settings-kv-sub\" data-i18n=\"sessionHint\">Cierra la sesión en este navegador. El historial local se queda.</p>\n              <button type=\"button\" id=\"settings-logout-btn\" class=\"logout-big-btn\" data-i18n=\"logout\">Cerrar sesión</button>\n            </div>\n          </div>\n        </div>\n\n        <div id=\"pane-appearance\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabAppearance\">Apariencia</div>\n          <p class=\"settings-section-desc\" data-i18n=\"appearanceDesc\">Tema, tamaño de letra y densidad de la interfaz.</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"appearanceTheme\">Tema</label>\n            <div class=\"theme-grid\">\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"dark\"><span class=\"theme-swatch\" data-swatch=\"dark\"></span><span data-i18n=\"themeDark\">Oscuro</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"gray\"><span class=\"theme-swatch\" data-swatch=\"gray\"></span><span data-i18n=\"themeGray\">Gris</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"dim\"><span class=\"theme-swatch\" data-swatch=\"dim\"></span><span data-i18n=\"themeDim\">Carbón</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"navy\"><span class=\"theme-swatch\" data-swatch=\"navy\"></span><span data-i18n=\"themeNavy\">Marino</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"light\"><span class=\"theme-swatch\" data-swatch=\"light\"></span><span data-i18n=\"themeLight\">Claro</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"paper\"><span class=\"theme-swatch\" data-swatch=\"paper\"></span><span data-i18n=\"themePaper\">Papel</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"hacker\"><span class=\"theme-swatch\" data-swatch=\"hacker\"></span><span>Hacker</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"cyberpunk\"><span class=\"theme-swatch\" data-swatch=\"cyberpunk\"></span><span>Cyberpunk</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"sunset\"><span class=\"theme-swatch\" data-swatch=\"sunset\"></span><span>Sunset</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"ocean\"><span class=\"theme-swatch\" data-swatch=\"ocean\"></span><span>Ocean</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"forest\"><span class=\"theme-swatch\" data-swatch=\"forest\"></span><span>Forest</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"rose\"><span class=\"theme-swatch\" data-swatch=\"rose\"></span><span>Rose</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"lavender\"><span class=\"theme-swatch\" data-swatch=\"lavender\"></span><span>Lavender</span></button>\n              <button type=\"button\" class=\"theme-card\" data-pref=\"ta_theme\" data-value=\"system\"><span class=\"theme-swatch\" data-swatch=\"system\"></span><span data-i18n=\"themeSystem\">Sistema</span></button>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"accentLabel\">Acento</label>\n            <div class=\"accent-row\">\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#38bdf8\" style=\"background:#38bdf8\" title=\"Cielo\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#a1a1aa\" style=\"background:#a1a1aa\" title=\"Gris\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#34d399\" style=\"background:#34d399\" title=\"Menta\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#2dd4bf\" style=\"background:#2dd4bf\" title=\"Teal\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#818cf8\" style=\"background:#818cf8\" title=\"Índigo\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#a78bfa\" style=\"background:#a78bfa\" title=\"Violeta\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#f59e0b\" style=\"background:#f59e0b\" title=\"Ámbar\"></button>\n              <button type=\"button\" class=\"accent-dot\" data-pref=\"ta_accent\" data-value=\"#fb7185\" style=\"background:#fb7185\" title=\"Rosa\"></button>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"fontSize\">Tamaño de letra</label>\n            <div class=\"choice-row\">\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_font\" data-value=\"sm\" data-i18n=\"fontSm\">Compacto</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_font\" data-value=\"md\" data-i18n=\"fontMd\">Normal</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_font\" data-value=\"lg\" data-i18n=\"fontLg\">Grande</button>\n            </div>\n          </div>\n          <div class=\"settings-card\">\n            <label class=\"toggle-row\"><span data-i18n=\"compactSidebar\">Barra lateral compacta</span><input type=\"checkbox\" id=\"set-compact-sb\"></label>\n            <label class=\"toggle-row\"><span data-i18n=\"reduceMotion\">Reducir movimiento</span><input type=\"checkbox\" id=\"set-reduce-motion\"></label>\n          </div>\n        </div>\n\n        <div id=\"pane-behavior\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabBehavior\">Comportamiento</div>\n          <p class=\"settings-section-desc\" data-i18n=\"behaviorDesc\">Cómo envía, busca y confirma el workspace.</p>\n          <div class=\"settings-card\">\n            <label class=\"toggle-row\"><span data-i18n=\"enterToSend\">Enter envía el mensaje</span><input type=\"checkbox\" id=\"set-enter-send\" checked></label>\n            <label class=\"toggle-row\"><span data-i18n=\"autoSearch\">Buscar en la web por defecto</span><input type=\"checkbox\" id=\"set-auto-search\"></label>\n            <label class=\"toggle-row\"><span data-i18n=\"showTimestamps\">Mostrar hora en los mensajes</span><input type=\"checkbox\" id=\"set-show-time\"></label>\n            <label class=\"toggle-row\"><span data-i18n=\"confirmDeleteChat\">Confirmar al borrar un chat</span><input type=\"checkbox\" id=\"set-confirm-del\" checked></label>\n            <label class=\"toggle-row\"><span data-i18n=\"autoRead\">Leer en voz alta las respuestas</span><input type=\"checkbox\" id=\"set-auto-read\"></label>\n          </div>\n          <p class=\"settings-hint\" data-i18n=\"autoReadHint\">Al terminar cada respuesta, el navegador la lee. También puedes pulsar el altavoz del compositor o «Escuchar» en cada mensaje.</p>\n        </div>\n\n        <div id=\"pane-customize\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabCustomize\">Personalizar</div>\n          <p class=\"settings-section-desc\" data-i18n=\"customizeDesc\">Instrucciones propias y tono de respuesta.</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"toneLabel\">Tono</label>\n            <div class=\"choice-row\">\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_tone\" data-value=\"auto\" data-i18n=\"toneAuto\">Auto</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_tone\" data-value=\"direct\" data-i18n=\"toneDirect\">Directo</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_tone\" data-value=\"technical\" data-i18n=\"toneTechnical\">Técnico</button>\n              <button type=\"button\" class=\"choice-pill\" data-pref=\"ta_tone\" data-value=\"concise\" data-i18n=\"toneConcise\">Conciso</button>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"systemPrompt\">Instrucción de sistema</label>\n            <textarea id=\"custom-system-prompt\" class=\"form-textarea\" placeholder=\"Cómo debe responder Trujillo AI…\"></textarea>\n          </div>\n          <div class=\"settings-card\">\n            <label class=\"toggle-row\"><span data-i18n=\"useDocsContext\">Usar documentos como memoria</span><input type=\"checkbox\" id=\"set-use-docs\" checked></label>\n            <label class=\"toggle-row\"><span data-i18n=\"adaptOn\">Adaptarse a mí</span><input type=\"checkbox\" id=\"set-adapt\" checked></label>\n          </div>\n          <p class=\"settings-hint\" data-i18n=\"adaptHint\">Trujillo recuerda cómo te llamas, lo que le pides que no olvide y los temas que sueles tratar. Dile «recuerda que…» o «olvida eso».</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"adaptSummary\">Lo que sé de ti</label>\n            <div id=\"adapt-summary\" class=\"settings-hint\">—</div>\n          </div>\n          <div id=\"adapt-notes\" class=\"settings-card\"></div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"adaptAdd\">Añadir un hecho</label>\n            <div style=\"display:flex;gap:6px\">\n              <input type=\"text\" id=\"adapt-note-input\" class=\"form-input\" style=\"flex:1\" data-i18n=\"adaptAddPh\" data-i18n-attr=\"placeholder\" placeholder=\"Recuerda que…\">\n              <button type=\"button\" id=\"adapt-note-btn\" class=\"topbar-action-btn primary\" data-i18n=\"save\">Guardar</button>\n            </div>\n          </div>\n          <button type=\"button\" id=\"adapt-forget-btn\" class=\"topbar-action-btn\" data-i18n=\"adaptForget\">Olvidar mi perfil</button>\n        </div>\n\n        \n        <div id=\"pane-integrations\" class=\"settings-pane\">\n          <div class=\"settings-section-title\">Integraciones y Discord</div>\n          <p class=\"settings-section-desc\">Gestiona las conexiones y añade el bot a donde prefieras.</p>\n          \n          <div class=\"settings-block-title\">Discord Bot</div>\n          <div class=\"settings-card\">\n            <div class=\"settings-kv\">\n              <div>\n                <div class=\"settings-kv-label\">Añadir a un Servidor</div>\n                <div class=\"settings-kv-sub\">Invita a Trujillo AI a tu servidor para usarlo en canales comunitarios.</div>\n              </div>\n              <a href=\"https://discord.com/oauth2/authorize?client_id=1538306837240225842&permissions=8&integration_type=0&scope=bot%20applications.commands\" target=\"_blank\" class=\"topbar-action-btn primary\" style=\"text-decoration:none; white-space:nowrap;\">Añadir al Server</a>\n            </div>\n            <div class=\"settings-kv\">\n              <div>\n                <div class=\"settings-kv-label\">Añadir a mi Cuenta</div>\n                <div class=\"settings-kv-sub\">Instala el bot directamente en tu perfil para usarlo en cualquier DM o chat.</div>\n              </div>\n              <a href=\"https://discord.com/oauth2/authorize?client_id=1538306837240225842&integration_type=1&scope=applications.commands\" target=\"_blank\" class=\"topbar-action-btn\" style=\"text-decoration:none; white-space:nowrap;\">Instalar App</a>\n            </div>\n            <div class=\"settings-kv\" style=\"flex-direction:column; align-items:flex-start; gap:8px; border-bottom:0;\">\n              <div class=\"settings-kv-label\">¿Cómo usarlo?</div>\n              <ul style=\"padding-left: 20px; font-size: 0.82rem; color: var(--muted); line-height: 1.5; margin: 0;\">\n                <li style=\"margin-bottom: 4px;\">Invócalo mencionando <code style=\"background: var(--line); padding: 2px 6px; border-radius: 4px; color: var(--text); font-family: monospace;\">@Trujillo AI</code> o usa sus comandos <code>/</code>.</li>\n                <li>Escríbele por <strong style=\"color: var(--text);\">Mensaje Directo</strong> para asistencia privada ininterrumpida.</li>\n              </ul>\n            </div>\n          </div>\n        </div>\n\n        <div id=\"pane-plan\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabPlan\">Plan y facturación</div>\n          <p class=\"settings-section-desc\" data-i18n=\"planDesc\">Tu plan actual. El cobro con tarjeta llegará cuando se active Stripe.</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"currentPlan\">Plan actual</label>\n            <div><span class=\"plan-badge\" id=\"plan-current-badge\">FREE</span></div>\n          </div>\n          <p class=\"settings-hint\" data-i18n=\"planHint\">Free: 50.000 tokens/día. Enterprise: sin tope (cuentas propias). BYOK: clave Groq en el navegador, sin cuota.</p>\n          <a class=\"topbar-action-btn\" href=\"mailto:alberto@trujillomingorance.com?subject=Trujillo%20AI%20Enterprise\" style=\"text-decoration:none;width:fit-content\" data-i18n=\"planContact\">Contactar para Enterprise</a>\n        </div>\n\n        <div id=\"pane-usage\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabUsage\">Uso</div>\n          <p class=\"settings-section-desc\" data-i18n=\"usageDesc\">Consumo diario y cuándo se reinicia el cupo.</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"usageUsed\">Tokens de hoy</label>\n            <div id=\"usage-used\" style=\"font-weight:650\">—</div>\n            <div class=\"usage-bar\"><span id=\"usage-bar-fill\"></span></div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"usageReset\">Reinicio disponible</label>\n            <div id=\"usage-reset\">00:00 UTC</div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"opsToday\">Actividad de hoy (servicio)</label>\n            <div class=\"ops-grid\">\n              <div class=\"ops-stat\"><b id=\"ops-chats\">—</b><span data-i18n=\"opsChats\">Chats</span></div>\n              <div class=\"ops-stat\"><b id=\"ops-images\">—</b><span data-i18n=\"opsImages\">Imágenes</span></div>\n              <div class=\"ops-stat\"><b id=\"ops-voice\">—</b><span data-i18n=\"opsVoice\">Voz</span></div>\n              <div class=\"ops-stat\"><b id=\"ops-ideas\">—</b><span data-i18n=\"opsIdeas\">Ideas</span></div>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"byok\">Clave Groq (BYOK)</label>\n            <input type=\"password\" id=\"user-groq-key\" class=\"form-input\" placeholder=\"gsk_…\" autocomplete=\"off\">\n            <span class=\"settings-hint\" data-i18n=\"byokHint\">Solo se guarda en este navegador.</span>\n          </div>\n        </div>\n\n        <div id=\"pane-ideas\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"ideas\">Qué quieres añadir</div>\n          <p class=\"settings-section-desc\" data-i18n=\"ideasDesc\">Cuéntale a Alberto qué función, corrección o mejora quieres. Llega a alberto@trujillomingorance.com y entra en el informe diario.</p>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"ideaCat\">Tipo</label>\n            <div class=\"choice-row\">\n              <button type=\"button\" class=\"choice-pill active\" data-idea-cat=\"feat\" data-i18n=\"ideaCatFeat\">Función</button>\n              <button type=\"button\" class=\"choice-pill\" data-idea-cat=\"fix\" data-i18n=\"ideaCatFix\">Corrección</button>\n              <button type=\"button\" class=\"choice-pill\" data-idea-cat=\"other\" data-i18n=\"ideaCatOther\">Otro</button>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"ideas\">Idea</label>\n            <textarea id=\"idea-text\" class=\"form-input\" rows=\"5\" data-i18n=\"ideasPh\" data-i18n-attr=\"placeholder\" placeholder=\"Quiero que la IA…\"></textarea>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"form-label\" data-i18n=\"ideasEmail\">Tu email (opcional)</label>\n            <input type=\"email\" id=\"idea-email\" class=\"form-input\" autocomplete=\"email\">\n          </div>\n          <div class=\"settings-actions\">\n            <button type=\"button\" id=\"idea-send-btn\" class=\"topbar-action-btn primary\" data-i18n=\"ideasSend\">Enviar a Alberto</button>\n          </div>\n          <p class=\"settings-hint\" id=\"idea-status\"></p>\n        </div>\n\n        <div id=\"pane-data\" class=\"settings-pane\">\n          <div class=\"settings-section-title\" data-i18n=\"tabData\">Controles de datos</div>\n          <p class=\"settings-section-desc\" data-i18n=\"dataDesc\">Exportar, vaciar o no persistir el workspace en este navegador.</p>\n          <div class=\"settings-card\">\n            <label class=\"toggle-row\"><span data-i18n=\"sessionOnly\">No guardar chats al cerrar</span><input type=\"checkbox\" id=\"set-ephemeral\"></label>\n          </div>\n          <p class=\"settings-hint\" data-i18n=\"sessionOnlyHint\">Si está activo, el historial no se escribe en localStorage.</p>\n          <div class=\"settings-card\">\n            <div class=\"settings-actions\">\n              <button type=\"button\" id=\"btn-export-all\" class=\"topbar-action-btn\" data-i18n=\"exportAll\">Exportar chats y documentos</button>\n            </div>\n            <div class=\"settings-actions\">\n              <button type=\"button\" id=\"btn-clear-chats\" class=\"topbar-action-btn\" data-i18n=\"clearChats\">Vaciar historial de chats</button>\n            </div>\n            <div class=\"settings-actions\">\n              <button type=\"button\" id=\"btn-clear-docs\" class=\"topbar-action-btn\" data-i18n=\"empty\">Vaciar documentos</button>\n            </div>\n          </div>\n          <div class=\"settings-block-title\" style=\"color:var(--red)\" data-i18n=\"dangerZone\">Zona peligrosa</div>\n          <div class=\"settings-card\">\n            <div class=\"settings-kv\">\n              <div>\n                <div class=\"settings-kv-label\" data-i18n=\"deleteAccount\">Eliminar cuenta</div>\n                <div class=\"settings-kv-sub\" data-i18n=\"deleteConfirm\">Esto borra tu cuenta en el servidor. ¿Continuar?</div>\n              </div>\n              <button type=\"button\" id=\"delete-account-btn\" class=\"topbar-action-btn btn-danger\" data-i18n=\"deleteAccount\">Eliminar cuenta</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"modal-footer\">\n      <span id=\"settings-status\" class=\"settings-status\"></span>\n      <button class=\"settings-foot-btn\" data-modal=\"modal-settings\" type=\"button\" data-i18n=\"cancel\">Cancelar</button>\n      <button id=\"save-settings-btn\" class=\"settings-foot-btn primary\" type=\"button\" data-i18n=\"save\">Guardar</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"modal-backdrop\" id=\"modal-profile\">\n  <div class=\"modal-card\">\n    <div class=\"modal-header\"><div class=\"modal-title\">Cuenta</div><button class=\"modal-close-btn\" data-modal=\"modal-profile\" type=\"button\">✕</button></div>\n    <div class=\"modal-body\" id=\"profile-modal-body\"></div>\n  </div>\n</div>\n\n<div class=\"modal-backdrop\" id=\"modal-knowledge\">\n  <div class=\"modal-card\">\n    <div class=\"modal-header\"><div class=\"modal-title\">Nuevo documento</div><button class=\"modal-close-btn\" data-modal=\"modal-knowledge\" type=\"button\">✕</button></div>\n    <div class=\"modal-body\">\n      <div class=\"form-group\">\n        <label class=\"form-label\">Título</label>\n        <input type=\"text\" id=\"train-title\" class=\"form-input\" placeholder=\"Especificación, notas, reglas…\">\n      </div>\n      <div class=\"form-group\">\n        <label class=\"form-label\">Contenido</label>\n        <textarea id=\"train-content\" class=\"form-textarea\" placeholder=\"Pega el texto…\"></textarea>\n      </div>\n      <div style=\"display:flex;justify-content:space-between;align-items:center\">\n        <input type=\"file\" id=\"import-rag-file\" style=\"display:none\" multiple accept=\".txt,.md,.json\">\n        <button type=\"button\" id=\"import-docs-btn\" class=\"topbar-action-btn\">Importar archivos</button>\n        <button id=\"save-knowledge-btn\" class=\"topbar-action-btn primary\" type=\"button\">Guardar</button>\n      </div>\n      <div>\n        <div style=\"display:flex;justify-content:space-between;margin-bottom:8px\">\n          <span class=\"form-label\">Activos (<span id=\"knowledge-count\">0</span>/20)</span>\n          <button id=\"clear-rag-btn\" type=\"button\" style=\"background:none;border:none;color:var(--red);font-size:0.72rem;cursor:pointer\">Vaciar</button>\n        </div>\n        <div id=\"knowledge-list-box\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"cmd-overlay\" id=\"cmd-overlay\" role=\"dialog\" aria-label=\"Paleta de comandos\">\n  <div class=\"cmd-box\">\n    <input id=\"cmd-input\" type=\"search\" autocomplete=\"off\" placeholder=\"Ir a un comando…\" data-i18n=\"palettePh\" data-i18n-attr=\"placeholder\">\n    <div id=\"cmd-list\"></div>\n  </div>\n</div>\n\n<div class=\"modal-backdrop\" id=\"modal-share\">\n  <div class=\"modal-card\">\n    <div class=\"modal-header\"><div class=\"modal-title\">Compartir conversación</div><button class=\"modal-close-btn\" data-modal=\"modal-share\" type=\"button\">✕</button></div>\n    <div class=\"modal-body\">\n      <p style=\"font-size:0.84rem;color:var(--muted)\">Quien tenga el enlace podrá leerla (30 días).</p>\n      <div style=\"display:flex;gap:6px\">\n        <input type=\"text\" id=\"share-link-input\" class=\"form-input\" readonly style=\"flex:1\">\n        <button id=\"share-copy-btn\" class=\"topbar-action-btn primary\" type=\"button\">Copiar</button>\n      </div>\n      <div id=\"share-toast\" style=\"display:none;font-size:0.75rem;color:var(--green);font-weight:650\">Enlace copiado</div>\n    </div>\n  </div>\n</div>\n</div>";


  var currentChatId = Date.now().toString();
  var chats = {};
  try {
    var raw = localStorage.getItem('ta_ai_chats');
    if (raw) chats = JSON.parse(raw);
    if (!chats || typeof chats !== 'object' || Array.isArray(chats)) chats = {};
  } catch(e) { chats = {}; }

  var isGenerating = false;
  var isWebSearch = localStorage.getItem('ta_auto_search') === '1';
  var isImageMode = false;
  var currentLength = localStorage.getItem('ta_len_mode') || 'normal';
  var attachedFile = null;
  var currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem('trujillo_ai_user') || 'null'); } catch(e) {}
  var authToken = localStorage.getItem('trujillo_ai_token') || '';
  (function consumeSocialCallback() {
    try {
      var params = new URLSearchParams(location.search);
      var state = params.get('state') || '';
      if (params.get('auth') !== 'x_callback' && state.indexOf('x_oauth_') !== 0) return;
      var code = params.get('code');
      history.replaceState({}, document.title, '/');
      if (!code) return;
      fetch('/api/auth/x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, redirectUri: location.origin + '/?auth=x_callback' })
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok || !res.d.token) return;
          localStorage.setItem('trujillo_ai_token', res.d.token);
          localStorage.setItem('trujillo_ai_user', JSON.stringify(res.d.user));
          location.reload();
        }).catch(function () {});
    } catch (e) {}
  })();
  var knowledge = [];
  try {
    var rawK = localStorage.getItem('ta_knowledge');
    if (rawK) knowledge = JSON.parse(rawK);
    if (!Array.isArray(knowledge)) knowledge = [];
  } catch(e) { knowledge = []; }
  var customConnectors = [];
  try {
    var rawC = localStorage.getItem('ta_connectors');
    if (rawC) customConnectors = JSON.parse(rawC);
    if (!Array.isArray(customConnectors)) customConnectors = [];
  } catch(e) { customConnectors = []; }

  var documents = [];
  try {
    var rawD = localStorage.getItem('ta_documents');
    if (rawD) documents = JSON.parse(rawD);
    if (!Array.isArray(documents)) documents = [];
  } catch(e) { documents = []; }
  if (!documents.length && knowledge.length) {
    documents = knowledge.map(function(k, i) {
      return { id: 'doc_mig_' + i, title: k.title || 'Nota', content: k.content || '', type: 'note', created: Date.now(), projectId: null };
    });
  }

  var projects = [];
  try {
    var rawP = localStorage.getItem('ta_projects');
    if (rawP) projects = JSON.parse(rawP);
    if (!Array.isArray(projects)) projects = [];
  } catch(e) { projects = []; }
  var currentProjectId = null;
  var sidebarView = 'chats';
  var abortCtl = null;
  var selectedModel = localStorage.getItem('ta_model') || 'openai/gpt-oss-120b';
  var MODELS = [
    { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B', desc: 'm120' },
    { id: 'qwen/qwen3.6-27b', name: 'Qwen 3.6 27B', desc: 'm27' },
    { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B', desc: 'm20' }
  ];
  var TONES = {
    auto: '',
    direct: 'Responde de forma directa y sin rodeos.',
    technical: 'Prioriza precisión técnica, nombres de APIs y código.',
    concise: 'Responde en el mínimo de palabras útil.'
  };
  function t(k) { return (window.TA && TA.t) ? TA.t(k) : k; }
  var THEME_COLORS = { dark: '#000000', gray: '#18181b', dim: '#0d1117', navy: '#0b1220', light: '#f4f4f5', paper: '#f4efe6', hacker: '#000000', cyberpunk: '#0d021a', sunset: '#1f101d', ocean: '#061325', forest: '#07130e', rose: '#fff1f2', lavender: '#f8f6fc' };
  var ACCENT_OK = { '#38bdf8': 1, '#a1a1aa': 1, '#34d399': 1, '#2dd4bf': 1, '#818cf8': 1, '#a78bfa': 1, '#f59e0b': 1, '#fb7185': 1 };
  function applyAppearance() {
    var theme = localStorage.getItem('ta_theme') || 'dark';
    var resolved = theme;
    if (theme === 'system') {
      resolved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    if (!THEME_COLORS[resolved]) resolved = 'dark';
    var accent = localStorage.getItem('ta_accent') || '#38bdf8';
    if (!ACCENT_OK[accent]) accent = '#38bdf8';
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.style.setProperty('--blue', accent);
    document.documentElement.setAttribute('data-font', localStorage.getItem('ta_font') || 'md');
    document.documentElement.classList.toggle('compact-sb', localStorage.getItem('ta_compact_sb') === '1');
    document.documentElement.classList.toggle('reduce-motion', localStorage.getItem('ta_reduce_motion') === '1');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[resolved] || '#000000');
  }
  applyAppearance();
  if (window.matchMedia) {
    try { window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyAppearance); } catch (e) {}
  }
  if (localStorage.getItem('ta_ephemeral') === '1') chats = {};
  var SEND_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  var STOP_ICON = '<svg width="14" height="14" viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/></svg>';
  var currentArtifact = null;
  var shareReadOnly = false;
  var showArchived = false;

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function parseMarkdownFull(src) {
    if (!src) return '';
    var text = src;
    var codeBlocks = [];
    text = text.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, function(match, lang, code) {
      var placeholder = '§§CODEBLOCK_' + codeBlocks.length + '§§';
      var safeLang = lang.trim() || 'code';
      var html = '<div class="code-block-box"><div class="code-block-header"><span>' + escapeHtml(safeLang) + '</span>' +
        '<button class="code-copy-btn" data-code="' + encodeURIComponent(code) + '">Copiar</button></div>' +
        '<pre class="code-block-pre"><code>' + escapeHtml(code) + '</code></pre></div>';
      codeBlocks.push(html);
      return placeholder;
    });
    text = escapeHtml(text);
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, url) {
      return '<div class="ai-image-card"><img src="' + url + '" alt="' + alt + '" class="ai-image-img" data-img-url="' + url + '" loading="lazy">' +
        '<div class="ai-image-footer"><span style="font-size:0.75rem;font-weight:600">' + alt + '</span>' +
        '<a href="' + url + '" target="_blank" download="trujillo-ai-visual.jpg" class="topbar-action-btn" style="text-decoration:none;padding:3px 8px;font-size:0.7rem">Descargar</a></div></div>';
    });
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--blue);text-decoration:none">$1</a>');
    var lines = text.split(/\r?\n/);
    var inTable = false; var tableRows = []; var newLines = [];
    function buildHtmlTable(rows) {
      if (!rows.length) return '';
      var hasSep = rows.some(function(r) { return r.type === 'sep'; });
      var html = '<div class="table-wrapper"><table class="ta-table">';
      var headerDone = false; var tbodyOpen = false;
      for (var r = 0; r < rows.length; r++) {
        var item = rows[r];
        if (item.type === 'sep') { headerDone = true; continue; }
        if (!headerDone && hasSep && r === 0) {
          html += '<thead><tr>';
          for (var c = 0; c < item.cells.length; c++) html += '<th>' + item.cells[c] + '</th>';
          html += '</tr></thead>';
        } else {
          if (!tbodyOpen) { html += '<tbody>'; tbodyOpen = true; }
          html += '<tr>';
          for (var c2 = 0; c2 < item.cells.length; c2++) html += '<td>' + item.cells[c2] + '</td>';
          html += '</tr>';
        }
      }
      if (tbodyOpen) html += '</tbody>';
      return html + '</table></div>';
    }
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) inTable = true;
        if (/^\|(\s*[-:]+[-| :]*)\|$/.test(line)) tableRows.push({ type: 'sep' });
        else tableRows.push({ type: 'row', cells: line.slice(1, -1).split('|').map(function(c) { return c.trim(); }) });
      } else {
        if (inTable) { newLines.push(buildHtmlTable(tableRows)); tableRows = []; inTable = false; }
        newLines.push(lines[i]);
      }
    }
    if (inTable) newLines.push(buildHtmlTable(tableRows));
    text = newLines.join('\n');
    text = text.replace(/(?:^|\n)(?:&gt;|>)\s*([\s\S]*?)(?=\n\n|\n(?!&gt;|>)|$)/g, function(match, quoteContent) {
      return '\n<blockquote class="ta-blockquote">' + quoteContent.replace(/^(?:&gt;|>)\s?/gm, '') + '</blockquote>\n';
    });
    text = text.replace(/^(?:---|___|\*\*\*)\s*$/gm, '<hr class="ta-hr">');
    text = text.replace(/^#### (.*$)/gim, '<h4>$1</h4>').replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^# (.*$)/gim, '<h1>$1</h1>');
    text = text.replace(/`([^`]+)`/g, '<code class="ta-inline-code">$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    text = text.replace(/(?:^|\n)[-•*]\s+([\s\S]*?)(?=\n\n|\n[^-•*\s]|$)/g, function(match) {
      var items = match.trim().split(/\n[-•*]\s+/);
      var listHtml = '<ul class="ta-ul">';
      for (var k = 0; k < items.length; k++) {
        var it = items[k].replace(/^[-•*]\s+/, '').trim();
        if (it) listHtml += '<li>' + it + '</li>';
      }
      return '\n' + listHtml + '</ul>\n';
    });
    text = text.replace(/(?:^|\n)\d+\.\s+([\s\S]*?)(?=\n\n|\n(?!\d+\.)|$)/g, function(match) {
      var items = match.trim().split(/\n\d+\.\s+/);
      var listHtml = '<ol class="ta-ol">';
      for (var k = 0; k < items.length; k++) {
        var it = items[k].replace(/^\d+\.\s+/, '').trim();
        if (it) listHtml += '<li>' + it + '</li>';
      }
      return '\n' + listHtml + '</ol>\n';
    });
    var blocks = text.split(/\n{2,}/);
    text = blocks.map(function(b) {
      var trimmed = b.trim();
      if (!trimmed) return '';
      if (/^<(div|table|blockquote|ul|ol|h[1-6]|hr|pre)/i.test(trimmed) || /^§§CODEBLOCK_\d+§§$/.test(trimmed)) return trimmed;
      return '<p>' + trimmed.replace(/\n/g, '<br>') + '</p>';
    }).join('\n\n');
    text = text.replace(/(?<![\w/&])\$([A-Za-z][A-Za-z0-9_]{1,8})\b/g, function(match, sym) {
      return '<span class="cashtag-chip" data-sym="' + sym.toUpperCase() + '">$' + sym.toUpperCase() + '</span>';
    });
    for (var c = 0; c < codeBlocks.length; c++) text = text.replace('§§CODEBLOCK_' + c + '§§', codeBlocks[c]);
    return text;
  }

  function renderMarkdown(text) {
    if (!text) return '';
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
      try {
        var rawHtml = marked.parse(text, { gfm: true, breaks: true });
        rawHtml = rawHtml.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrapper"><table class="ta-table">$1</table></div>');
        rawHtml = rawHtml.replace(/<pre><code(?:\s+class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g, function(match, lang, code) {
          var safeLang = (lang || 'code').trim();
          var rawCode = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
          return '<div class="code-block-box"><div class="code-block-header"><span>' + escapeHtml(safeLang) + '</span>' +
            '<button class="code-copy-btn" data-code="' + encodeURIComponent(rawCode) + '">Copiar</button></div>' +
            '<pre class="code-block-pre"><code>' + code + '</code></pre></div>';
        });
        rawHtml = rawHtml.replace(/<img\s+src="([^"]*)"\s+alt="([^"]*)"[^>]*>/g, function(match, src, alt) {
          return '<div class="ai-image-card"><img src="' + src + '" alt="' + alt + '" class="ai-image-img" data-img-url="' + src + '" loading="lazy">' +
            '<div class="ai-image-footer"><span style="font-size:0.75rem;font-weight:600">' + alt + '</span>' +
            '<a href="' + src + '" target="_blank" download="trujillo-ai-visual.jpg" class="topbar-action-btn" style="text-decoration:none;padding:3px 8px;font-size:0.7rem">Descargar</a></div></div>';
        });
        rawHtml = rawHtml.replace(/(?<![\w/&])\$([A-Za-z][A-Za-z0-9_]{1,8})\b/g, function(match, sym) {
          return '<span class="cashtag-chip" data-sym="' + sym.toUpperCase() + '">$' + sym.toUpperCase() + '</span>';
        });
        return rawHtml;
      } catch(e) {}
    }
    return parseMarkdownFull(text);
  }

  async function showCashtagQuote(symbol, el) {
    if (!el) return;
    var existing = el.querySelector('.cashtag-popover');
    if (existing) { existing.remove(); return; }
    document.querySelectorAll('.cashtag-popover').forEach(function(p) { p.remove(); });
    var pop = document.createElement('div');
    pop.className = 'cashtag-popover';
    pop.innerHTML = '<div style="font-size:0.75rem;color:var(--dim)">Cargando $' + symbol + '…</div>';
    el.appendChild(pop);
    pop.onclick = function(e) { e.stopPropagation(); };
    try {
      var res = await fetch('/api/market/quote?symbol=' + encodeURIComponent(symbol));
      if (res.ok) {
        var d = await res.json();
        var isUp = (d.change24h || 0) >= 0;
        var priceFmt = (d.price >= 1)
          ? '$' + d.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : '$' + (d.price || 0).toFixed(4);
        pop.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:700"><span>$' + symbol + '</span><span style="color:var(--dim)">' + escapeHtml(d.source || 'Spot') + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;margin:6px 0"><div style="font-size:1.1rem;font-weight:750;font-family:var(--mono)">' + priceFmt + '</div>' +
          '<div style="font-size:0.75rem;font-weight:700;color:' + (isUp ? 'var(--green)' : 'var(--red)') + '">' + (isUp ? '+' : '') + (d.change24h || 0).toFixed(2) + '%</div></div>' +
          '<div style="border-top:1px solid var(--line);padding-top:6px;display:flex;justify-content:space-between;font-size:0.68rem;color:var(--dim)"><span>Vol. ' + escapeHtml(d.volume || 'N/A') + '</span>' +
          '<a href="https://www.tradingview.com/symbols/' + encodeURIComponent(symbol) + '/" target="_blank" rel="noopener" style="color:var(--blue);text-decoration:none">TradingView</a></div>';
        return;
      }
    } catch(e) {}
    pop.innerHTML = '<div style="font-size:0.75rem;color:var(--dim)">No disponible</div>';
  }

  var currentUtterance = null;
  var speakKeepAlive = null;
  var speakQueue = [];
  var speakActiveBtn = null;

  function resetSpeakButtons() {
    document.querySelectorAll('.speak-msg-btn').forEach(function(b) {
      b.classList.remove('speaking');
      b.innerHTML = '<span>' + t('listen') + '</span>';
    });
    var dockSpeak = document.getElementById('speak-last-btn');
    if (dockSpeak) dockSpeak.classList.remove('speaking');
  }

  function stopSpeakKeepAlive() {
    if (speakKeepAlive) { clearInterval(speakKeepAlive); speakKeepAlive = null; }
  }

  function startSpeakKeepAlive() {
    stopSpeakKeepAlive();
    speakKeepAlive = setInterval(function() {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        stopSpeakKeepAlive();
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 8000);
  }

  function uiLangBcp47() {
    var id = (window.TA && TA.lang) ? TA.lang() : 'es';
    var map = {
      es: 'es-ES', en: 'en-US', pt: 'pt-PT', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', ca: 'ca-ES',
      zh: 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR', ar: 'ar-SA', hi: 'hi-IN', ru: 'ru-RU',
      nl: 'nl-NL', pl: 'pl-PL', tr: 'tr-TR', vi: 'vi-VN', th: 'th-TH', uk: 'uk-UA', he: 'he-IL',
      sv: 'sv-SE', da: 'da-DK', fi: 'fi-FI', nb: 'nb-NO', cs: 'cs-CZ', hu: 'hu-HU', ro: 'ro-RO',
      el: 'el-GR', id: 'id-ID', ms: 'ms-MY', fil: 'fil-PH', hr: 'hr-HR', bg: 'bg-BG', fa: 'fa-IR',
      ur: 'ur-PK', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN'
    };
    return map[id] || 'es-ES';
  }
  function pickUiVoice() {
    var want = uiLangBcp47().toLowerCase();
    var prefix = want.slice(0, 2);
    var voices = Array.prototype.slice.call(window.speechSynthesis.getVoices() || []);
    var exact = voices.filter(function(v) { return (v.lang || '').toLowerCase() === want; });
    if (exact.length) return exact[0];
    var pref = voices.filter(function(v) { return (v.lang || '').toLowerCase().indexOf(prefix) === 0; });
    if (pref.length) return pref[0];
    for (var j = 0; j < voices.length; j++) {
      if (voices[j].default) return voices[j];
    }
    return voices[0] || null;
  }

  function splitSpeakChunks(text) {
    var max = 180;
    var parts = [];
    var rest = (text || '').replace(/\s+/g, ' ').trim();
    while (rest.length > max) {
      var slice = rest.slice(0, max);
      var cut = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('? '), slice.lastIndexOf('! '), slice.lastIndexOf(', '), slice.lastIndexOf(' '));
      if (cut < 40) cut = max;
      parts.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1).trim();
    }
    if (rest) parts.push(rest);
    return parts;
  }

  function stopSpeaking() {
    speakQueue = [];
    speakActiveBtn = null;
    currentUtterance = null;
    stopSpeakKeepAlive();
    try { window.speechSynthesis.cancel(); } catch (e) {}
    resetSpeakButtons();
  }

  function speakNextChunk() {
    if (!speakQueue.length) {
      stopSpeakKeepAlive();
      resetSpeakButtons();
      currentUtterance = null;
      speakActiveBtn = null;
      return;
    }
    var chunk = speakQueue.shift();
    var ut = new SpeechSynthesisUtterance(chunk);
    var voice = pickUiVoice();
    if (voice) {
      ut.voice = voice;
      ut.lang = voice.lang;
    } else {
      ut.lang = uiLangBcp47();
    }
    ut.rate = 1.02;
    ut.volume = 1;
    currentUtterance = ut;
    ut.onend = function() {
      if (speakActiveBtn) speakNextChunk();
    };
    ut.onerror = function() {
      if (speakQueue.length) speakNextChunk();
      else {
        stopSpeakKeepAlive();
        resetSpeakButtons();
        currentUtterance = null;
        speakActiveBtn = null;
      }
    };
    startSpeakKeepAlive();
    window.speechSynthesis.speak(ut);
  }

  function speakText(text, btn) {
    if (!('speechSynthesis' in window)) return alert('Este navegador no puede leer en voz alta.');
    if (speakActiveBtn && btn && speakActiveBtn === btn && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
      stopSpeaking();
      return;
    }
    stopSpeaking();
    var clean = (text || '')
      .replace(/```[\s\S]*?```/g, ' bloque de código omitido. ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' imagen. ')
      .replace(/https?:\/\/\S+/g, ' enlace. ')
      .replace(/[#*_>`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return;
    speakActiveBtn = btn;
    speakQueue = splitSpeakChunks(clean);
    if (btn) {
      btn.classList.add('speaking');
      if (!btn.classList.contains('dock-btn')) {
        btn.innerHTML = '<span>' + t('stopListen') + '</span>';
      }
    }
    window.speechSynthesis.getVoices();
    setTimeout(function() {
      if (!speakActiveBtn) return;
      try { window.speechSynthesis.cancel(); } catch (e) {}
      setTimeout(speakNextChunk, 60);
    }, 40);
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); };
  }

  function saveChats() {
    try {
      if (localStorage.getItem('ta_ephemeral') === '1') { localStorage.removeItem('ta_ai_chats'); return; }
      var persist = {};
      Object.keys(chats).forEach(function(k) {
        if (chats[k] && !chats[k].ephemeral) persist[k] = chats[k];
      });
      var dump = JSON.parse(JSON.stringify(persist));
      var kept = 0;
      Object.keys(dump).sort(function(a, b) { return Number(b) - Number(a); }).forEach(function(k) {
        var msgs = dump[k] && dump[k].messages;
        if (!Array.isArray(msgs)) return;
        for (var i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i] && msgs[i].image) {
            kept++;
            if (kept > 4) delete msgs[i].image;
          }
        }
      });
      localStorage.setItem('ta_ai_chats', JSON.stringify(dump));
    } catch(e) {}
  }
  function emptyLocalProfile() {
    return { enabled: true, name: '', notes: [], topics: {}, summary: '', turns: 0 };
  }
  function loadLocalProfile() {
    try {
      var raw = localStorage.getItem('ta_profile');
      if (!raw) return emptyLocalProfile();
      var p = JSON.parse(raw);
      return p && typeof p === 'object' ? p : emptyLocalProfile();
    } catch (e) { return emptyLocalProfile(); }
  }
  function saveLocalProfile(p) {
    try { localStorage.setItem('ta_profile', JSON.stringify(p || emptyLocalProfile())); } catch (e) {}
  }
  function adaptEnabled() { return localStorage.getItem('ta_adapt') !== '0'; }
  function renderAdaptPane() {
    var p = loadLocalProfile();
    var sum = document.getElementById('adapt-summary');
    var box = document.getElementById('adapt-notes');
    var toggle = document.getElementById('set-adapt');
    if (toggle) toggle.checked = adaptEnabled();
    if (sum) {
      var bits = [];
      if (p.name) bits.push(p.name);
      if (p.summary) bits.push(p.summary);
      else if (p.notes && p.notes.length) bits.push((p.notes.length) + ' ' + t('adaptAdd').toLowerCase());
      sum.textContent = bits.join(' · ') || t('adaptEmpty');
    }
    if (!box) return;
    box.innerHTML = '';
    (p.notes || []).slice().reverse().forEach(function(n) {
      var row = document.createElement('div');
      row.className = 'settings-kv';
      var meta = [n.category, n.expiresAt ? ('hasta ' + new Date(n.expiresAt).toISOString().slice(0, 10)) : '']
        .filter(Boolean).join(' · ');
      row.innerHTML = '<div><div class="settings-kv-sub" style="color:var(--text)">' + escapeHtml(n.fact || n.text || '') + '</div>' +
        (meta ? '<div class="settings-hint">' + escapeHtml(meta) + '</div>' : '') + '</div>' +
        '<button type="button" class="mini-x" data-del-note="' + escapeHtml(n.id || '') + '">✕</button>';
      box.appendChild(row);
    });
  }
  function postProfile(body) {
    var headers = { 'Content-Type': 'application/json' };
    if (authToken) headers.Authorization = 'Bearer ' + authToken;
    return fetch('/api/profile', { method: 'POST', headers: headers, body: JSON.stringify(body) })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.profile) saveLocalProfile(d.profile);
        renderAdaptPane();
        return d;
      });
  }
  function pullProfile() {
    var headers = {};
    if (authToken) headers.Authorization = 'Bearer ' + authToken;
    return fetch('/api/profile', { headers: headers })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d && d.profile) {
          if (d.synced || !loadLocalProfile().notes || !loadLocalProfile().notes.length) saveLocalProfile(d.profile);
        }
        renderAdaptPane();
      })
      .catch(function() { renderAdaptPane(); });
  }
  function isTempChat() {
    return !!(chats[currentChatId] && chats[currentChatId].ephemeral);
  }
  function updateTempBadge() {
    var badge = document.getElementById('temp-badge');
    if (badge) badge.classList.toggle('on', isTempChat() || localStorage.getItem('ta_ephemeral') === '1');
  }
  function startTempChat() {
    if (shareReadOnly) { shareReadOnly = false; history.replaceState({}, '', '/'); }
    currentChatId = Date.now().toString();
    chats[currentChatId] = { title: t('tempChat'), messages: [], ephemeral: true, projectId: currentProjectId };
    loadChatView();
    renderSidebar();
    updateTempBadge();
    if (window.innerWidth <= 860) toggleSidebar(false);
    var pi = document.getElementById('prompt-input');
    if (pi) pi.focus();
  }
  function saveDocuments() {
    try { localStorage.setItem('ta_documents', JSON.stringify(documents)); } catch(e) {}
    knowledge = documents.map(function(d) { return { title: d.title, content: d.content }; });
    try { localStorage.setItem('ta_knowledge', JSON.stringify(knowledge)); } catch(e) {}
  }
  function saveProjects() { try { localStorage.setItem('ta_projects', JSON.stringify(projects)); } catch(e) {} }

  function startNewChat() {
    if (shareReadOnly) { shareReadOnly = false; history.replaceState({}, '', '/'); }
    currentChatId = Date.now().toString();
    loadChatView();
    renderSidebar();
    updateTempBadge();
    if (window.innerWidth <= 860) toggleSidebar(false);
  }

  var CHIP_STOP = {
    el:1, la:1, los:1, las:1, un:1, una:1, de:1, del:1, en:1, y:1, o:1, que:1, para:1, con:1, por:1,
    the:1, a:1, an:1, of:1, to:1, and:1, or:1, is:1, it:1, this:1, that:1, hola:1, hey:1, ok:1, si:1,
    me:1, mi:1, tu:1, su:1, al:1, lo:1, se:1, es:1, da:1, um:1, le:1, les:1, des:1, du:1, et:1,
    you:1, we:1, i:1, my:1, your:1, how:1, what:1, why:1, can:1, please:1, gracias:1, como:1
  };

  function chatStamp(id, chat) {
    return Number((chat && (chat.updatedAt || chat.updated)) || id) || 0;
  }

  function firstUserText(chat) {
    if (!chat || !Array.isArray(chat.messages)) return '';
    for (var i = 0; i < chat.messages.length; i++) {
      if (chat.messages[i] && chat.messages[i].role === 'user' && chat.messages[i].content) {
        return String(chat.messages[i].content).replace(/\s+/g, ' ').trim();
      }
    }
    return '';
  }

  function chipTokens(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/https?:\/\/\S+/g, ' ')
      .split(/[^a-z0-9$]+/)
      .filter(function(w) { return w.length > 2 && !CHIP_STOP[w]; });
  }

  function isGenericChipTitle(title) {
    var s = String(title || '').trim().toLowerCase();
    if (!s || s.length < 3) return true;
    return /^(conversaci[oó]n|nueva conversaci[oó]n|new chat|chat|untitled|sin t[ií]tulo|nova conversa)$/i.test(s);
  }

  function recentChatsForRecs(n) {
    return Object.keys(chats)
      .map(function(id) { return chats[id] ? { id: id, c: chats[id] } : null; })
      .filter(function(x) {
        return x && x.c && !x.c.ephemeral && !x.c.archived && x.c.messages && x.c.messages.length;
      })
      .sort(function(a, b) { return chatStamp(b.id, b.c) - chatStamp(a.id, a.c); })
      .slice(0, n)
      .map(function(x) { return x.c; });
  }

  function genericHeroChips() {
    return [
      { label: t('chipDoc'), prompt: t('chipDoc') },
      { label: t('chipArch'), prompt: t('chipArch') },
      { label: t('chipBtc'), prompt: t('chipBtc') },
      { label: t('chipImage'), prompt: t('chipImage') }
    ];
  }

  function recommendHeroChips() {
    var generic = genericHeroChips();
    var recent = recentChatsForRecs(5);
    if (!recent.length) return generic;
    var recs = [];
    var seen = {};
    recent.forEach(function(c) {
      var first = firstUserText(c);
      var title = String(c.title || '').replace(/\s+/g, ' ').trim();
      var label = !isGenericChipTitle(title) ? title.slice(0, 48) : first.slice(0, 48);
      if (!label) return;
      var sig = chipTokens(label).slice(0, 4).join(' ');
      if (!sig || seen[sig]) return;
      seen[sig] = 1;
      var prompt = first
        ? (first.length <= 220 ? first : ((t('chipContinue') || 'Continúa con esto:') + ' ' + label))
        : label;
      recs.push({ label: label, prompt: prompt });
    });
    generic.forEach(function(g) {
      if (recs.length >= 4) return;
      recs.push(g);
    });
    return recs.slice(0, 4);
  }

  function renderHeroChips() {
    return recommendHeroChips().map(function(c) {
      return '<button type="button" class="hero-chip" data-prompt="' + escapeHtml(c.prompt) + '">' + escapeHtml(c.label) + '</button>';
    }).join('');
  }

  function loadChatView() {
    var container = document.getElementById('chat-container');
    if (!container) return;
    var chat = chats[currentChatId];
    if (!chat || !Array.isArray(chat.messages) || chat.messages.length === 0) {
      container.innerHTML = '<div class="ta-hero">' +
        '<img src="/avatar.png" alt="Trujillo AI" class="hero-logo-img">' +
        '<h1 class="hero-heading">' + t('heroTitle') + '</h1>' +
        '<p class="hero-subheading">' + t('heroSub') + '</p>' +
        '<div class="hero-chips">' + renderHeroChips() + '</div></div>';
      return;
    }
    container.innerHTML = '';
    chat.messages.forEach(function(m, i) {
      if (m && m.content) {
        try { addMessageToDOM(m.role, m.content, m.sources, m.at, i, m.feedback, m.image); } catch(e) {}
      }
    });
    scrollToEnd();
  }

  function sendQuick(text) {
    var inp = document.getElementById('prompt-input');
    if (!inp) return;
    inp.value = text;
    handleSend();
  }

  function formatMsgTime(at) {
    var d = at ? new Date(at) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  function addMessageToDOM(role, content, sources, at, msgIndex, feedback, image) {
    sources = sources || [];
    var container = document.getElementById('chat-container');
    if (!container) return { row: null, textContainer: null, contentCol: null };
    var hero = container.querySelector('.ta-hero');
    if (hero) hero.remove();
    var row = document.createElement('div');
    row.className = 'msg-row ' + (role === 'user' ? 'user' : 'ai');
    var textContainer, contentCol, bubble;
    var showTime = localStorage.getItem('ta_show_time') === '1';
    if (role === 'user') {
      var holder = document.createElement('div');
      holder.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;max-width:78%';
      bubble = document.createElement('div');
      bubble.className = 'user-bubble';
      bubble.style.maxWidth = '100%';
      if (image) {
        var im = document.createElement('img');
        im.src = image;
        im.alt = t('imageAttached') === 'imageAttached' ? 'Imagen' : t('imageAttached');
        im.style.cssText = 'max-width:220px;max-height:180px;object-fit:cover;border-radius:10px;margin:0 0 6px;display:block';
        holder.appendChild(im);
      }
      bubble.textContent = content || '';
      if (!content && image) bubble.style.display = 'none';
      holder.appendChild(bubble);
      var userActs = document.createElement('div');
      userActs.className = 'msg-actions';
      userActs.style.justifyContent = 'flex-end';
      var uCopy = document.createElement('button');
      uCopy.className = 'msg-action-btn';
      uCopy.textContent = t('copy');
      uCopy.onclick = function() {
        navigator.clipboard.writeText(content || '');
        uCopy.textContent = t('copied');
        setTimeout(function() { uCopy.textContent = t('copy'); }, 1800);
      };
      userActs.appendChild(uCopy);
      if (typeof msgIndex === 'number' && !shareReadOnly) {
        var uEdit = document.createElement('button');
        uEdit.className = 'msg-action-btn';
        uEdit.textContent = t('edit');
        uEdit.onclick = function() { editUserAt(msgIndex); };
        userActs.appendChild(uEdit);
      }
      holder.appendChild(userActs);
      if (showTime) {
        var tm = document.createElement('div');
        tm.className = 'msg-time';
        tm.textContent = formatMsgTime(at);
        holder.appendChild(tm);
      }
      row.appendChild(holder);
    } else {
      var avatarCol = document.createElement('div');
      avatarCol.className = 'ai-avatar-col';
      avatarCol.innerHTML = '<img src="/avatar.png" alt="Trujillo AI" class="ai-avatar-img">';
      contentCol = document.createElement('div');
      contentCol.className = 'ai-content-col';
      textContainer = document.createElement('div');
      textContainer.className = 'prose-ai';
      textContainer.innerHTML = renderMarkdown(content || '');
      contentCol.appendChild(textContainer);
      if (sources && sources.length > 0) {
        var srcBox = document.createElement('div');
        srcBox.className = 'sources-box';
        srcBox.innerHTML = '<div class="sources-title">' + t('sources') + '</div><div class="sources-list">' +
          sources.map(function(s) { return '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener" class="source-tag">' + escapeHtml(s.title) + '</a>'; }).join('') +
          '</div>';
        contentCol.appendChild(srcBox);
      }
      var actions = document.createElement('div');
      actions.className = 'msg-actions';
      var copyBtn = document.createElement('button');
      copyBtn.className = 'msg-action-btn';
      copyBtn.innerHTML = '<span>' + t('copy') + '</span>';
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(content || '');
        copyBtn.innerHTML = '<span style="color:var(--green)">' + t('copied') + '</span>';
        setTimeout(function() { copyBtn.innerHTML = '<span>' + t('copy') + '</span>'; }, 1800);
      };
      actions.appendChild(copyBtn);
      var voiceBtn = document.createElement('button');
      voiceBtn.className = 'msg-action-btn speak-msg-btn';
      voiceBtn.innerHTML = '<span>' + t('listen') + '</span>';
      voiceBtn.onclick = function() { speakText(content || '', voiceBtn); };
      actions.appendChild(voiceBtn);
      var regenBtn = document.createElement('button');
      regenBtn.className = 'msg-action-btn';
      regenBtn.innerHTML = '<span>' + t('regenerate') + '</span>';
      regenBtn.onclick = function() { regenerateLast(); };
      actions.appendChild(regenBtn);
      if (typeof msgIndex === 'number' && !shareReadOnly) {
        var up = document.createElement('button');
        up.className = 'msg-action-btn' + (feedback === 'up' ? ' on' : '');
        up.textContent = t('useful');
        up.onclick = function() { setFeedback(msgIndex, 'up'); };
        var down = document.createElement('button');
        down.className = 'msg-action-btn' + (feedback === 'down' ? ' on' : '');
        down.textContent = t('notUseful');
        down.onclick = function() { setFeedback(msgIndex, 'down'); };
        actions.appendChild(up);
        actions.appendChild(down);
      }
      contentCol.appendChild(actions);
      if (showTime) {
        var tmAi = document.createElement('div');
        tmAi.className = 'msg-time';
        tmAi.textContent = formatMsgTime(at);
        contentCol.appendChild(tmAi);
      }
      row.appendChild(avatarCol);
      row.appendChild(contentCol);
    }
    container.appendChild(row);
    scrollToEnd();
    return { row: row, textContainer: textContainer, contentCol: contentCol };
  }

  function extractArtifact(markdown) {
    if (!markdown) return null;
    var best = null;
    var re = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
    var m;
    while ((m = re.exec(markdown))) {
      var body = m[2] || '';
      if (body.split('\n').length >= 10 || body.length > 360) {
        if (!best || body.length > best.content.length) {
          best = { lang: (m[1] || 'text').trim() || 'text', content: body, title: guessArtTitle(m[1], body) };
        }
      }
    }
    if (!best && /^#\s+.+/m.test(markdown) && markdown.length > 500) {
      best = { lang: 'markdown', content: markdown, title: (markdown.match(/^#\s+(.+)/m) || [,'Documento'])[1].slice(0, 60) };
    }
    return best;
  }
  function guessArtTitle(lang, body) {
    var first = (body.split('\n').find(function(l) { return l.trim(); }) || '').replace(/^[#/*\s-]+/, '').slice(0, 48);
    return first || ((lang || 'documento') + ' · Trujillo');
  }
  function openArtifact(art) {
    currentArtifact = art;
    var panel = document.getElementById('art-panel');
    var title = document.getElementById('art-title');
    var body = document.getElementById('art-body');
    if (title) title.textContent = art.title || 'Artefacto';
    if (body) body.textContent = art.content || '';
    if (panel) panel.classList.add('open');
  }
  function closeArtifact() {
    var panel = document.getElementById('art-panel');
    if (panel) panel.classList.remove('open');
  }

  async function handleSend() {
    if (isGenerating || shareReadOnly) return;
    var input = document.getElementById('prompt-input');
    if (!input) return;
    var promptText = input.value.trim();
    if (!promptText && !attachedFile) return;
    isGenerating = true;
    abortCtl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    setGenerating(true);
    var nl = String.fromCharCode(10);
    var fullPrompt = promptText;
    var pendingImage = null;
    if (attachedFile) {
      if (attachedFile.kind === 'image') {
        pendingImage = attachedFile.dataUrl;
        fullPrompt = promptText || t('imageAttached');
      } else {
        fullPrompt = '[DOCUMENTO ADJUNTO: ' + attachedFile.name + ']:' + nl + attachedFile.content + nl + nl + (promptText || 'Analiza este documento.');
        addDocument({ title: attachedFile.name, content: attachedFile.content, type: 'upload' });
      }
      removeAttachedFile();
    }
    input.value = '';
    autoResize(input);
    if (!chats[currentChatId] || typeof chats[currentChatId] !== 'object') {
      chats[currentChatId] = { title: promptText.slice(0, 42) || 'Conversación', messages: [], projectId: currentProjectId };
    }
    if (!Array.isArray(chats[currentChatId].messages)) chats[currentChatId].messages = [];
    if (chats[currentChatId].title === 'Nueva conversación' && promptText) chats[currentChatId].title = promptText.slice(0, 42);
    var userLabel = promptText || (pendingImage ? t('imageAttached') : 'Documento adjunto');
    chats[currentChatId].messages.push({ role: 'user', content: userLabel, at: Date.now(), image: pendingImage || undefined });
    saveChats();
    renderSidebar();
    addMessageToDOM('user', userLabel, null, Date.now(), chats[currentChatId].messages.length - 1, null, pendingImage);
    var isImgRequest = isImageMode || /^(genera una imagen|dibuja|crea una imagen|haz una foto|imagen de|generate image)/i.test(promptText);
    var msgDom = addMessageToDOM('ai', '');
    var textContainer = msgDom.textContainer;
    var contentCol = msgDom.contentCol;
    if (textContainer) textContainer.innerHTML = '<span class="pulse-cursor"></span>';
    var fullText = '';
    var sources = [];
    var rememberedFacts = [];
    try {
      if (isImgRequest) {
        if (textContainer) textContainer.innerHTML = '<span style="color:var(--purple);font-weight:600;font-size:0.85rem">' + t('genImage') + '</span><span class="pulse-cursor"></span>';
        var imgRes = await fetch('/api/image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: abortCtl ? abortCtl.signal : undefined, body: JSON.stringify({ prompt: promptText }) });
        var imgData = await imgRes.json();
        if (imgData.ok && imgData.imageUrl) {
          var imgMd = '![' + (promptText.slice(0, 60) || 'Imagen') + '](' + imgData.imageUrl + ')';
          if (textContainer) textContainer.innerHTML = renderMarkdown(imgMd);
          chats[currentChatId].messages.push({ role: 'ai', content: imgMd, sources: [], at: Date.now() });
          saveChats();
        } else {
          throw new Error(imgData.error || 'Error al generar imagen');
        }
        return;
      }
      var customPrompt = localStorage.getItem('ta_custom_prompt') || '';
      var userApiKey = localStorage.getItem('ta_custom_key') || '';
      var headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
      if (userApiKey) headers['x-groq-user-key'] = userApiKey;
      var snippets = [];
      if (localStorage.getItem('ta_use_docs') !== '0') {
        snippets = documents.filter(function(d) {
          return !currentProjectId || d.projectId === currentProjectId || !d.projectId;
        }).slice(-6).map(function(d) { return { title: d.title, content: String(d.content || '').slice(0, 2500) }; });
      }
      var langInstr = t('replyLang');
      var toneInstr = TONES[localStorage.getItem('ta_tone') || 'auto'] || '';
      var tzVal = localStorage.getItem('ta_timezone');
      var resolvedTz = (tzVal && tzVal !== 'auto') ? tzVal : (function() {
        try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid'; } catch(e) { return 'Europe/Madrid'; }
      })();
      var payload = {
          prompt: fullPrompt,
          model: selectedModel,
          custom_prompt: [langInstr, toneInstr, customPrompt].filter(Boolean).join('\n'),
          knowledge_snippets: snippets,
          search_web: isWebSearch && !pendingImage,
          chat_history: chats[currentChatId].messages.slice(-8).map(function(m) {
            return { role: m.role, content: m.content };
          }),
          length_mode: currentLength,
          locale: (window.TA && TA.lang) ? TA.lang() : 'es',
          timezone: resolvedTz,
          client_time: new Date().toISOString(),
          adapt: adaptEnabled(),
          profile: adaptEnabled() ? loadLocalProfile() : undefined
        };
      if (pendingImage) payload.image = { dataUrl: pendingImage };
      var response = await fetch('/api/chat', {
        method: 'POST',
        headers: headers,
        signal: abortCtl ? abortCtl.signal : undefined,
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        var errJson = await response.json().catch(function() { return {}; });
        throw new Error(errJson.message || ('HTTP ' + response.status));
      }
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';
      while (true) {
        var chunkRes = await reader.read();
        if (chunkRes.done) break;
        buffer += decoder.decode(chunkRes.value, { stream: true });
        var lines = buffer.split(nl);
        buffer = lines.pop() || '';
        for (var i = 0; i < lines.length; i++) {
          var trimmed = lines[i].trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          var dataStr = trimmed.replace(/^data:\s*/, '');
          if (dataStr === '[DONE]') continue;
          try {
            var p = JSON.parse(dataStr);
            if (p.sources) sources = p.sources;
            if (p.profile) saveLocalProfile(p.profile);
            if (p.remembered && p.remembered.length) rememberedFacts = p.remembered;
            if (p.content) {
              fullText += p.content;
              if (textContainer) {
                textContainer.innerHTML = renderMarkdown(fullText) + '<span class="pulse-cursor"></span>';
                scrollToEnd();
              }
            }
          } catch(e) {}
        }
      }
      if (textContainer) textContainer.innerHTML = renderMarkdown(fullText);
      if (rememberedFacts.length && contentCol) {
        var memNote = document.createElement('div');
        memNote.className = 'msg-time';
        memNote.textContent = t('adaptRemembered') + ' ' + rememberedFacts[0];
        contentCol.appendChild(memNote);
      }
      if (sources && sources.length > 0 && contentCol) {
        var srcBox = document.createElement('div');
        srcBox.className = 'sources-box';
        srcBox.innerHTML = '<div class="sources-title">' + t('sources') + '</div><div class="sources-list">' +
          sources.map(function(s) { return '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener" class="source-tag">' + escapeHtml(s.title) + '</a>'; }).join('') +
          '</div>';
        contentCol.appendChild(srcBox);
      }
      chats[currentChatId].messages.push({ role: 'ai', content: fullText, sources: sources, at: Date.now() });
      saveChats();
      var art = extractArtifact(fullText);
      if (art) openArtifact(art);
      if (localStorage.getItem('ta_auto_read') === '1' && fullText) {
        var lastSpeak = document.querySelector('.msg-row.ai:last-child .speak-msg-btn');
        speakText(fullText, lastSpeak);
      }
    } catch(err) {
      var aborted = err && (err.name === 'AbortError' || /abort/i.test(err.message || ''));
      if (aborted) {
        if (fullText && chats[currentChatId]) {
          chats[currentChatId].messages.push({ role: 'ai', content: fullText, sources: sources || [], at: Date.now() });
          saveChats();
          if (textContainer) textContainer.innerHTML = renderMarkdown(fullText);
        } else if (textContainer) {
          textContainer.innerHTML = '<span style="color:var(--dim)">' + t('stopped') + '</span>';
        }
      } else if (textContainer) {
        textContainer.innerHTML = '<span style="color:var(--red);font-weight:600">' + t('error') + ': ' + escapeHtml(err.message) + '</span>';
      }
    } finally {
      isGenerating = false;
      abortCtl = null;
      setGenerating(false);
      scrollToEnd();
    }
  }

  function setGenerating(on) {
    isGenerating = on;
    var sendBtn = document.getElementById('send-btn');
    if (!sendBtn) return;
    sendBtn.innerHTML = on ? STOP_ICON : SEND_ICON;
    sendBtn.title = on ? t('stopGen') : t('send');
    sendBtn.classList.toggle('stopping', !!on);
    sendBtn.disabled = false;
  }
  function abortGeneration() {
    if (abortCtl) abortCtl.abort();
  }
  function currentModelMeta() {
    for (var i = 0; i < MODELS.length; i++) if (MODELS[i].id === selectedModel) return MODELS[i];
    return MODELS[0];
  }
  function renderModelPicker() {
    var label = document.getElementById('model-picker-label');
    var menu = document.getElementById('model-menu');
    var meta = currentModelMeta();
    if (label) label.textContent = meta.name;
    if (!menu) return;
    menu.innerHTML = MODELS.map(function(m) {
      return '<button type="button" class="model-option' + (m.id === selectedModel ? ' active' : '') + '" data-model="' + m.id + '" role="option">' +
        '<div class="model-option-name">' + m.name + '</div>' +
        '<div class="model-option-desc">' + t(m.desc) + '</div></button>';
    }).join('');
  }
  function setModel(id) {
    selectedModel = id;
    try { localStorage.setItem('ta_model', id); } catch(e) {}
    renderModelPicker();
    var picker = document.getElementById('model-picker');
    if (picker) picker.classList.remove('open');
    var btn = document.getElementById('model-picker-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var k = el.getAttribute('data-i18n');
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, t(k));
        if (attr === 'title') el.setAttribute('aria-label', t(k));
      } else el.textContent = t(k);
    });
    renderModelPicker();
    var chat = chats[currentChatId];
    if (!chat || !chat.messages || !chat.messages.length) loadChatView();
    renderSidebar();
    updateUserUI();
    fillLangSelect();
  }
  window.TA_applyI18n = applyI18n;
  function fillLangSelect() {
    if (!window.TA || !TA.mountPicker) return;
    TA.mountPicker(document.getElementById('lang-select'));
    TA.mountPicker(document.getElementById('set-lang'));
  }
  function exportChat() {
    var chat = chats[currentChatId];
    if (!chat || !chat.messages || !chat.messages.length) return;
    var md = '# ' + (chat.title || 'Trujillo AI') + '\n\n';
    chat.messages.forEach(function(m) {
      md += '## ' + (m.role === 'user' ? 'User' : 'Trujillo AI') + '\n\n' + (m.content || '') + '\n\n';
    });
    var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (chat.title || 'trujillo-ai').replace(/[^\w\-]+/g, '_').slice(0, 40) + '.md';
    a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
  }
  function commandItems() {
    return [
      { id: 'new', label: t('newChat'), hint: '⌘K', run: startNewChat },
      { id: 'temp', label: t('tempChat'), hint: '⌘⇧N', run: startTempChat },
      { id: 'settings', label: t('settings'), hint: '⌘,', run: function() { openSettingsModal('pane-general'); } },
      { id: 'share', label: t('share'), run: openShareModal },
      { id: 'export', label: t('exportChat'), run: exportChat },
      { id: 'search', label: t('searchPh'), run: function() { var s = document.getElementById('history-search'); if (s) { toggleSidebar(true); s.focus(); } } },
      { id: 'docs', label: t('docsLink'), run: function() { window.location.href = '/docs'; } },
      { id: 'rewrite', label: 'Rewrite AI — Humanización 0% IA & Corrector', run: function() { window.open('https://rewrite.trujillomingorance.com', '_blank'); } },
      { id: 'ideas', label: t('ideas'), run: function() { openSettingsModal('pane-ideas'); } }
    ];
  }
  function renderCommandPalette(q) {
    var list = document.getElementById('cmd-list');
    if (!list) return;
    q = (q || '').trim().toLowerCase();
    var items = commandItems().filter(function(c) { return !q || (c.label || '').toLowerCase().indexOf(q) !== -1; });
    list.innerHTML = '';
    items.forEach(function(c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cmd-item' + (i === 0 ? ' active' : '');
      b.innerHTML = '<span>' + escapeHtml(c.label) + '</span>' + (c.hint ? '<kbd>' + escapeHtml(c.hint) + '</kbd>' : '');
      b.onclick = function() { closeCommandPalette(); c.run(); };
      list.appendChild(b);
    });
  }
  function openCommandPalette() {
    var ov = document.getElementById('cmd-overlay');
    var inp = document.getElementById('cmd-input');
    if (!ov) return;
    ov.classList.add('open');
    renderCommandPalette('');
    if (inp) { inp.value = ''; inp.focus(); }
  }
  function closeCommandPalette() {
    var ov = document.getElementById('cmd-overlay');
    if (ov) ov.classList.remove('open');
  }
  function regenerateLast() {
    if (isGenerating) return;
    var chat = chats[currentChatId];
    if (!chat || !chat.messages || chat.messages.length < 2) return;
    var last = chat.messages[chat.messages.length - 1];
    if (last.role === 'ai' || last.role === 'assistant') chat.messages.pop();
    var userMsg = chat.messages[chat.messages.length - 1];
    if (!userMsg || userMsg.role !== 'user') return;
    chat.messages.pop();
    saveChats();
    var inp = document.getElementById('prompt-input');
    if (inp) inp.value = userMsg.content || '';
    handleSend();
  }
  function editUserAt(index) {
    if (isGenerating || shareReadOnly) return;
    var chat = chats[currentChatId];
    if (!chat || !chat.messages || !chat.messages[index] || chat.messages[index].role !== 'user') return;
    var text = chat.messages[index].content || '';
    chat.messages = chat.messages.slice(0, index);
    saveChats();
    loadChatView();
    var inp = document.getElementById('prompt-input');
    if (inp) {
      inp.value = text;
      autoResize(inp);
      inp.focus();
    }
  }
  function setFeedback(index, value) {
    var chat = chats[currentChatId];
    if (!chat || !chat.messages || !chat.messages[index]) return;
    chat.messages[index].feedback = chat.messages[index].feedback === value ? '' : value;
    saveChats();
    loadChatView();
  }
  function autoResize(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = (el.value.trim() ? Math.min(el.scrollHeight, 180) : 44) + 'px';
  }
  function setLengthMode(mode) {
    currentLength = mode;
    try { localStorage.setItem('ta_len_mode', mode); } catch(e) {}
    ['corto', 'normal', 'extendido'].forEach(function(m) {
      var btn = document.getElementById('len-btn-' + m);
      if (btn) { if (m === mode) btn.classList.add('active'); else btn.classList.remove('active'); }
    });
  }
  function toggleWebSearch() {
    isWebSearch = !isWebSearch;
    var btn = document.getElementById('web-search-pill');
    if (btn) { if (isWebSearch) btn.classList.add('active'); else btn.classList.remove('active'); }
  }
  function toggleImageMode() {
    isImageMode = !isImageMode;
    var btn = document.getElementById('image-gen-pill');
    var inp = document.getElementById('prompt-input');
    if (btn) {
      if (isImageMode) { btn.classList.add('active-purple'); if (inp) inp.placeholder = 'Describe la imagen…'; }
      else { btn.classList.remove('active-purple'); if (inp) inp.placeholder = 'Pregunta lo que quieras…'; }
    }
  }
  function toggleSidebar(open) {
    var sb = document.getElementById('sidebar');
    var ov = document.getElementById('sidebar-overlay');
    var closeBtn = document.getElementById('sidebar-close-btn');
    if (!sb) return;
    if (open) { sb.classList.add('open'); if (ov) ov.classList.add('active'); if (closeBtn) closeBtn.style.display = 'flex'; }
    else { sb.classList.remove('open'); if (ov) ov.classList.remove('active'); if (closeBtn) closeBtn.style.display = 'none'; }
  }

  function dayBucket(ts) {
    var d = new Date(Number(ts));
    var now = new Date();
    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (d.getTime() >= start) return t('today');
    if (d.getTime() >= start - 86400000) return t('yesterday');
    if (d.getTime() >= start - 6 * 86400000) return t('week');
    return t('older');
  }

  function setSidebarView(view) {
    sidebarView = view;
    ['chats', 'projects', 'docs'].forEach(function(v) {
      var el = document.getElementById('tab-' + v);
      if (el) { if (v === view) el.classList.add('active'); else el.classList.remove('active'); }
    });
    renderSidebar();
  }

  function renderSidebar(filterText) {
    filterText = (filterText || (document.getElementById('history-search') && document.getElementById('history-search').value) || '').trim().toLowerCase();
    var list = document.getElementById('history-list');
    if (!list) return;
    list.innerHTML = '';
    if (sidebarView === 'projects') return renderProjectsList(list, filterText);
    if (sidebarView === 'docs') return renderDocsList(list, filterText);
    renderHistoryList(list, filterText);
  }

  function renderHistoryList(list, filterText) {
    var keys = Object.keys(chats).sort(function(a, b) {
      var pa = chats[a] && chats[a].pinned ? 1 : 0;
      var pb = chats[b] && chats[b].pinned ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return Number(b) - Number(a);
    });
    keys = keys.filter(function(k) {
      var c = chats[k];
      if (!c) return false;
      if (currentProjectId && c.projectId !== currentProjectId) return false;
      if (!!c.archived !== showArchived) return false;
      if (filterText && !(c.title || '').toLowerCase().includes(filterText)) return false;
      return true;
    });
    var archCount = Object.keys(chats).filter(function(k) { return chats[k] && chats[k].archived; }).length;
    var archBar = document.createElement('div');
    archBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0 8px 8px';
    archBar.innerHTML = '<button type="button" class="mini-x" id="toggle-archived" style="opacity:1">' +
      (showArchived ? t('chats') : t('archived') + (archCount ? ' (' + archCount + ')' : '')) + '</button>';
    list.appendChild(archBar);
    if (currentProjectId) {
      var proj = projects.find(function(p) { return p.id === currentProjectId; });
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px 8px 8px';
      bar.innerHTML = '<span style="font-size:0.75rem;color:var(--muted)">Proyecto: ' + escapeHtml((proj && proj.name) || '—') + '</span>' +
        '<button type="button" class="mini-x" id="clear-project-filter" style="opacity:1">ver todos</button>';
      list.appendChild(bar);
    }
    if (!keys.length) {
      var emptyH = document.createElement('div');
      emptyH.className = 'empty-side';
      emptyH.textContent = t('noChats');
      list.appendChild(emptyH);
      return;
    }
    var lastBucket = '';
    keys.forEach(function(k) {
      var bucket = dayBucket(k);
      if (bucket !== lastBucket) {
        var h = document.createElement('div');
        h.className = 'history-section-title';
        h.textContent = bucket;
        list.appendChild(h);
        lastBucket = bucket;
      }
      var item = document.createElement('div');
      item.className = 'history-item' + (k === currentChatId ? ' active' : '');
      item.innerHTML = '<span class="history-title">' + (chats[k].pinned ? '• ' : '') + escapeHtml(chats[k].title || t('chats')) + '</span>' +
        '<button class="history-del-btn" data-arch-id="' + k + '" title="' + (chats[k].archived ? t('unarchive') : t('archive')) + '">▭</button>' +
        '<button class="history-del-btn" data-pin-id="' + k + '" title="' + t('pin') + '">*</button>' +
        '<button class="history-del-btn" data-del-id="' + k + '" title="✕">✕</button>';
      item.onclick = function(e) {
        if (e.target.getAttribute('data-arch-id')) {
          chats[k].archived = !chats[k].archived;
          saveChats();
          renderSidebar();
          return;
        }
        if (e.target.getAttribute('data-pin-id')) {
          chats[k].pinned = !chats[k].pinned;
          saveChats();
          renderSidebar();
          return;
        }
        if (e.target.classList.contains('history-del-btn')) {
          var delId = e.target.getAttribute('data-del-id') || k;
          if (localStorage.getItem('ta_confirm_del') !== '0' && !confirm(t('confirmDeleteOne'))) return;
          delete chats[delId];
          saveChats();
          if (delId === currentChatId) startNewChat();
          else renderSidebar();
          return;
        }
        currentChatId = k;
        loadChatView();
        renderSidebar();
        updateTempBadge();
        if (window.innerWidth <= 860) toggleSidebar(false);
      };
      list.appendChild(item);
    });
  }

  function renderProjectsList(list, filterText) {
    var head = document.createElement('button');
    head.type = 'button';
    head.className = 'new-chat-btn';
    head.style.margin = '4px 4px 10px';
    head.innerHTML = '<span>+ ' + t('newProject') + '</span>';
    head.onclick = createProject;
    list.appendChild(head);
    var filtered = projects.filter(function(p) { return !filterText || (p.name || '').toLowerCase().includes(filterText); });
    if (!filtered.length) {
      var emptyP = document.createElement('div');
      emptyP.className = 'empty-side';
      emptyP.textContent = t('noProjects');
      list.appendChild(emptyP);
      return;
    }
    filtered.forEach(function(p) {
      var count = Object.keys(chats).filter(function(k) { return chats[k].projectId === p.id; }).length;
      var item = document.createElement('div');
      item.className = 'proj-item' + (currentProjectId === p.id ? ' active' : '');
      item.innerHTML = '<span class="history-title">' + escapeHtml(p.name) + ' · ' + count + '</span>' +
        '<button class="mini-x" data-del-proj="' + p.id + '">✕</button>';
      item.onclick = function(e) {
        if (e.target.getAttribute('data-del-proj')) {
          var id = e.target.getAttribute('data-del-proj');
          projects = projects.filter(function(x) { return x.id !== id; });
          Object.keys(chats).forEach(function(k) { if (chats[k].projectId === id) chats[k].projectId = null; });
          documents.forEach(function(d) { if (d.projectId === id) d.projectId = null; });
          if (currentProjectId === id) currentProjectId = null;
          saveProjects(); saveChats(); saveDocuments();
          renderSidebar();
          return;
        }
        currentProjectId = p.id;
        sidebarView = 'chats';
        setSidebarView('chats');
      };
      list.appendChild(item);
    });
  }

  function renderDocsList(list, filterText) {
    var head = document.createElement('button');
    head.type = 'button';
    head.className = 'new-chat-btn';
    head.style.margin = '4px 4px 10px';
    head.innerHTML = '<span>+ ' + t('addDoc') + '</span>';
    head.onclick = function() { openKnowledgeModal(); };
    list.appendChild(head);
    var filtered = documents.filter(function(d) {
      if (currentProjectId && d.projectId && d.projectId !== currentProjectId) return false;
      if (filterText && !(d.title || '').toLowerCase().includes(filterText)) return false;
      return true;
    });
    if (!filtered.length) {
      var emptyD = document.createElement('div');
      emptyD.className = 'empty-side';
      emptyD.textContent = t('noDocs');
      list.appendChild(emptyD);
      return;
    }
    filtered.slice().reverse().forEach(function(d) {
      var item = document.createElement('div');
      item.className = 'doc-item';
      item.innerHTML = '<span class="doc-title">' + escapeHtml(d.title || 'Documento') + '</span>' +
        '<button class="mini-x" data-del-doc="' + d.id + '">✕</button>';
      item.onclick = function(e) {
        if (e.target.getAttribute('data-del-doc')) {
          documents = documents.filter(function(x) { return x.id !== d.id; });
          saveDocuments();
          renderSidebar();
          return;
        }
        openArtifact({ title: d.title, content: d.content, lang: d.lang || 'text' });
      };
      list.appendChild(item);
    });
  }

  function createProject() {
    var name = prompt(t('projName'));
    if (!name || !name.trim()) return;
    var p = { id: 'p_' + Date.now(), name: name.trim(), created: Date.now() };
    projects.unshift(p);
    currentProjectId = p.id;
    saveProjects();
    sidebarView = 'chats';
    setSidebarView('chats');
  }

  function addDocument(doc) {
    documents.push({
      id: 'doc_' + Date.now(),
      title: doc.title || 'Documento',
      content: String(doc.content || '').slice(0, 20000),
      type: doc.type || 'note',
      lang: doc.lang || '',
      created: Date.now(),
      projectId: currentProjectId
    });
    while (documents.length > 20) documents.shift();
    saveDocuments();
  }

  function scrollToEnd() {
    var s = document.getElementById('chat-scroll');
    if (s) s.scrollTop = s.scrollHeight;
  }

  function paintAttachedBadge(file) {
    var nameEl = document.getElementById('attached-name');
    var kindEl = document.getElementById('attached-kind');
    var thumb = document.getElementById('attached-thumb');
    var badge = document.getElementById('attached-badge');
    if (nameEl) nameEl.textContent = file.name;
    if (kindEl) kindEl.textContent = file.kind === 'image' ? t('image') : t('attached');
    if (thumb) {
      if (file.kind === 'image' && file.dataUrl) {
        thumb.src = file.dataUrl;
        thumb.hidden = false;
      } else {
        thumb.removeAttribute('src');
        thumb.hidden = true;
      }
    }
    if (badge) badge.classList.add('active');
  }
  function compressImageFile(file, maxDim, quality) {
    return new Promise(function(resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function() {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * scale));
        var h = Math.max(1, Math.round(img.height * scale));
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = function() {
        URL.revokeObjectURL(url);
        reject(new Error('image'));
      };
      img.src = url;
    });
  }
  function attachDroppedFile(f) {
    if (!f) return;
    if (/^image\//.test(f.type)) {
      if (f.size > 8 * 1024 * 1024) return alert(t('maxImage'));
      compressImageFile(f, 1280, 0.72).then(function(dataUrl) {
        attachedFile = { name: f.name, kind: 'image', dataUrl: dataUrl, mime: 'image/jpeg' };
        paintAttachedBadge(attachedFile);
      }).catch(function() { alert(t('error')); });
      return;
    }
    if (f.size > 250000) return alert('Tamaño máximo: 250 KB.');
    var reader = new FileReader();
    reader.onload = function(ev) {
      attachedFile = { name: f.name, kind: 'text', content: ev.target.result };
      paintAttachedBadge(attachedFile);
    };
    reader.readAsText(f);
  }
  function handleFileUpload(e) {
    var f = e.target.files[0];
    attachDroppedFile(f);
  }
  function removeAttachedFile() {
    attachedFile = null;
    var badge = document.getElementById('attached-badge');
    if (badge) badge.classList.remove('active');
    var thumb = document.getElementById('attached-thumb');
    if (thumb) { thumb.hidden = true; thumb.removeAttribute('src'); }
    var up = document.getElementById('file-uploader');
    if (up) up.value = '';
  }

  var speechRec = null;
  var mediaRec = null;
  var mediaChunks = [];
  var mediaStream = null;
  function stopMicVisual() {
    var btn = document.getElementById('mic-btn');
    if (btn) btn.classList.remove('recording');
  }
  function appendTranscript(text) {
    if (!text) return;
    var inp = document.getElementById('prompt-input');
    if (!inp) return;
    inp.value = (inp.value ? inp.value.replace(/\s+$/, '') + ' ' : '') + text;
    autoResize(inp);
  }
  async function transcribeBlob(blob) {
    var headers = {};
    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
    var userApiKey = localStorage.getItem('ta_custom_key') || '';
    if (userApiKey) headers['x-groq-user-key'] = userApiKey;
    var fd = new FormData();
    fd.append('file', blob, 'voice.webm');
    var lang = (window.TA && TA.lang) ? TA.lang() : 'es';
    var res = await fetch('/api/transcribe?lang=' + encodeURIComponent(lang), { method: 'POST', headers: headers, body: fd });
    var data = await res.json().catch(function() { return {}; });
    if (!res.ok) throw new Error(data.error || t('error'));
    return data.text || '';
  }
  function toggleSpeech() {
    var btn = document.getElementById('mic-btn');
    if (speechRec || mediaRec) {
      if (speechRec) { try { speechRec.stop(); } catch (e) {} speechRec = null; }
      if (mediaRec && mediaRec.state !== 'inactive') { try { mediaRec.stop(); } catch (e) {} }
      return;
    }
    stopSpeaking();
    var liveText = '';
    var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      speechRec = new SpeechRec();
      speechRec.lang = uiLangBcp47();
      speechRec.interimResults = true;
      speechRec.continuous = true;
      speechRec.onstart = function() { if (btn) btn.classList.add('recording'); };
      speechRec.onresult = function(ev) {
        var out = '';
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) out += ev.results[i][0].transcript;
        }
        if (out) { liveText += (liveText ? ' ' : '') + out; appendTranscript(out); }
      };
      speechRec.onerror = function() {};
      try { speechRec.start(); } catch (e) { speechRec = null; }
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (!speechRec) alert(t('voiceUnsupported'));
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      mediaStream = stream;
      mediaChunks = [];
      var mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      mediaRec = new MediaRecorder(stream);
      mediaRec.ondataavailable = function(ev) { if (ev.data && ev.data.size) mediaChunks.push(ev.data); };
      mediaRec.onstart = function() { if (btn) btn.classList.add('recording'); };
      mediaRec.onstop = function() {
        stopMicVisual();
        if (mediaStream) mediaStream.getTracks().forEach(function(tr) { tr.stop(); });
        mediaStream = null;
        mediaRec = null;
        if (speechRec) { try { speechRec.stop(); } catch (e2) {} speechRec = null; }
        if (liveText.trim()) return;
        if (!mediaChunks.length) return;
        var blob = new Blob(mediaChunks, { type: mime });
        mediaChunks = [];
        var inp = document.getElementById('prompt-input');
        if (inp) inp.placeholder = t('transcribing');
        transcribeBlob(blob).then(function(text) {
          appendTranscript(text);
          if (inp) inp.placeholder = t('askPh');
        }).catch(function() {
          if (inp) inp.placeholder = t('askPh');
          alert(t('error'));
        });
      };
      mediaRec.start();
      setTimeout(function() {
        if (mediaRec && mediaRec.state === 'recording') mediaRec.stop();
      }, 45000);
    }).catch(function() {
      if (!speechRec) alert(t('voiceUnsupported'));
    });
  }
  function speakLastReply() {
    var chat = chats[currentChatId];
    if (!chat || !chat.messages) return;
    for (var i = chat.messages.length - 1; i >= 0; i--) {
      if (chat.messages[i].role === 'ai' || chat.messages[i].role === 'assistant') {
        var btn = document.getElementById('speak-last-btn');
        speakText(chat.messages[i].content || '', btn);
        return;
      }
    }
  }

  function openModal(id) { var m = document.getElementById(id); if (m) m.classList.add('active'); }
  function closeModal(id) { var m = document.getElementById(id); if (m) m.classList.remove('active'); }
  function showSettingsPane(id) {
    document.querySelectorAll('.settings-pane').forEach(function(p) { p.classList.toggle('active', p.id === id); });
    document.querySelectorAll('.settings-nav-btn').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-pane') === id); });
  }
  function setChoice(pref, value) {
    document.querySelectorAll('[data-pref="' + pref + '"]').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-value') === value);
    });
  }
  function planLabel() {
    if (localStorage.getItem('ta_custom_key')) return 'BYOK';
    if (currentUser && currentUser.tier === 'enterprise') return 'ENTERPRISE';
    return 'FREE';
  }
  function refreshUsagePane() {
    var usedEl = document.getElementById('usage-used');
    var bar = document.getElementById('usage-bar-fill');
    var resetEl = document.getElementById('usage-reset');
    var badge = document.getElementById('plan-current-badge');
    var accBadge = document.getElementById('account-plan-badge');
    var label = planLabel();
    function paintBadge(el) {
      if (!el) return;
      el.textContent = label;
      el.classList.toggle('ent', label === 'ENTERPRISE');
      el.classList.toggle('byok', label === 'BYOK');
    }
    paintBadge(badge);
    paintBadge(accBadge);
    if (label !== 'FREE') {
      if (usedEl) usedEl.textContent = t('unlimited');
      if (bar) bar.style.width = '0%';
      if (resetEl) resetEl.textContent = '—';
    }
    fetch('/api/usage', { headers: authToken ? { 'Authorization': 'Bearer ' + authToken } : {} })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var u = d.usage || {};
        if (label === 'FREE') {
          var cur = u.current || 0;
          var lim = u.limit || 50000;
          var pct = Math.min(100, Math.round((cur / lim) * 100));
          if (usedEl) usedEl.textContent = cur.toLocaleString() + ' / ' + lim.toLocaleString();
          if (bar) bar.style.width = pct + '%';
          if (resetEl) resetEl.textContent = t('usageResetUtc');
        }
        var ops = d.ops || {};
        var setOps = function(id, v) { var el = document.getElementById(id); if (el) el.textContent = String(v || 0); };
        setOps('ops-chats', ops.chats);
        setOps('ops-images', ops.images);
        setOps('ops-voice', ops.transcribe);
        setOps('ops-ideas', ops.ideas);
      })
      .catch(function() { if (usedEl) usedEl.textContent = t('tokensDay'); });
  }
  var ideaCat = 'feat';
  function submitIdea() {
    var textEl = document.getElementById('idea-text');
    var mailEl = document.getElementById('idea-email');
    var status = document.getElementById('idea-status');
    var text = textEl ? textEl.value.trim() : '';
    if (text.length < 8) {
      if (status) status.textContent = t('ideaTooShort');
      return;
    }
    var btn = document.getElementById('idea-send-btn');
    if (btn) btn.disabled = true;
    fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idea: text,
        email: (mailEl && mailEl.value) || (currentUser && currentUser.email) || '',
        name: (currentUser && currentUser.name) || '',
        cat: ideaCat
      })
    }).then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
      .then(function(res) {
        if (status) status.textContent = res.ok ? t('ideasOk') : (res.d.message || t('ideasErr'));
        if (res.ok && textEl) textEl.value = '';
      })
      .catch(function() { if (status) status.textContent = t('ideasErr'); })
      .then(function() { if (btn) btn.disabled = false; });
  }
  function openSettingsModal(tab) {
    if (typeof tab !== 'string') tab = 'pane-general';
    var kEl = document.getElementById('user-groq-key');
    var pEl = document.getElementById('custom-system-prompt');
    if (kEl) kEl.value = localStorage.getItem('ta_custom_key') || '';
    if (pEl) pEl.value = localStorage.getItem('ta_custom_prompt') || '';
    var enterEl = document.getElementById('set-enter-send');
    var autoEl = document.getElementById('set-auto-search');
    if (enterEl) enterEl.checked = localStorage.getItem('ta_enter_send') !== '0';
    if (autoEl) autoEl.checked = localStorage.getItem('ta_auto_search') === '1';
    var autoReadEl = document.getElementById('set-auto-read');
    if (autoReadEl) autoReadEl.checked = localStorage.getItem('ta_auto_read') === '1';
    var ideaMail = document.getElementById('idea-email');
    if (ideaMail && currentUser && currentUser.email && !ideaMail.value) ideaMail.value = currentUser.email;
    var timeEl = document.getElementById('set-show-time');
    var confEl = document.getElementById('set-confirm-del');
    var compactEl = document.getElementById('set-compact-sb');
    var motionEl = document.getElementById('set-reduce-motion');
    var docsEl = document.getElementById('set-use-docs');
    var ephEl = document.getElementById('set-ephemeral');
    if (timeEl) timeEl.checked = localStorage.getItem('ta_show_time') === '1';
    if (confEl) confEl.checked = localStorage.getItem('ta_confirm_del') !== '0';
    if (compactEl) compactEl.checked = localStorage.getItem('ta_compact_sb') === '1';
    if (motionEl) motionEl.checked = localStorage.getItem('ta_reduce_motion') === '1';
    if (docsEl) docsEl.checked = localStorage.getItem('ta_use_docs') !== '0';
    var adaptEl = document.getElementById('set-adapt');
    if (adaptEl) adaptEl.checked = adaptEnabled();
    pullProfile();
    if (ephEl) ephEl.checked = localStorage.getItem('ta_ephemeral') === '1';
    setChoice('ta_theme', localStorage.getItem('ta_theme') || 'dark');
    setChoice('ta_accent', localStorage.getItem('ta_accent') || '#38bdf8');
    setChoice('ta_font', localStorage.getItem('ta_font') || 'md');
    setChoice('ta_len_mode', localStorage.getItem('ta_len_mode') || 'normal');
    setChoice('ta_tone', localStorage.getItem('ta_tone') || 'auto');
    if (window.TA && TA.mountPicker) TA.mountPicker(document.getElementById('set-lang'));
    var modelSel = document.getElementById('set-default-model');
    if (modelSel) {
      modelSel.innerHTML = MODELS.map(function(m) {
        return '<option value="' + m.id + '"' + (m.id === selectedModel ? ' selected' : '') + '>' + m.name + '</option>';
      }).join('');
    }
    var guest = document.getElementById('account-guest');
    var authed = document.getElementById('account-authed');
    if (currentUser && authToken) {
      if (guest) guest.style.display = 'none';
      if (authed) authed.style.display = 'block';
      var nameIn = document.getElementById('set-display-name');
      if (nameIn) nameIn.value = currentUser.name || '';
      var emailIn = document.getElementById('account-email-display');
      if (emailIn) emailIn.textContent = currentUser.email || '';
      var np = document.getElementById('set-notify-product');
      var ns = document.getElementById('set-notify-security');
      if (np) np.checked = currentUser.notifyProduct !== false;
      if (ns) ns.checked = currentUser.notifySecurity !== false;
      var nd = document.getElementById('set-notify-digest');
      if (nd) nd.checked = currentUser.notifyDigest === true;
      var curPass = document.getElementById('set-cur-pass');
      var neu = document.getElementById('set-new-pass');
      if (curPass) { curPass.value = ''; curPass.placeholder = t('currentPassword'); }
      if (neu) { neu.value = ''; neu.placeholder = t('newPassword'); }
      var passWrap = document.getElementById('password-fields');
      var oauthHint = document.getElementById('oauth-pass-hint');
      var oauthOnly = !currentUser.hasPassword && currentUser.provider && currentUser.provider !== 'email';
      if (passWrap) passWrap.style.display = oauthOnly ? 'none' : 'block';
      if (oauthHint) {
        oauthHint.style.display = oauthOnly ? 'block' : 'none';
        oauthHint.textContent = currentUser.provider === 'x' ? t('linkedX') : t('linkedGoogle');
      }
    } else {
      if (guest) guest.style.display = 'block';
      if (authed) authed.style.display = 'none';
    }
    var st = document.getElementById('settings-status');
    if (st) st.style.display = 'none';
    refreshUsagePane();
    showSettingsPane(tab || 'pane-general');
    openModal('modal-settings');
  }
  async function saveSettings() {
    var kEl = document.getElementById('user-groq-key');
    var pEl = document.getElementById('custom-system-prompt');
    var k = kEl ? kEl.value.trim() : '';
    var p = pEl ? pEl.value.trim() : '';
    if (k) localStorage.setItem('ta_custom_key', k); else localStorage.removeItem('ta_custom_key');
    if (p) localStorage.setItem('ta_custom_prompt', p); else localStorage.removeItem('ta_custom_prompt');
    var enterEl = document.getElementById('set-enter-send');
    var autoEl = document.getElementById('set-auto-search');
    localStorage.setItem('ta_enter_send', enterEl && enterEl.checked ? '1' : '0');
    localStorage.setItem('ta_auto_search', autoEl && autoEl.checked ? '1' : '0');
    var autoReadEl = document.getElementById('set-auto-read');
    localStorage.setItem('ta_auto_read', autoReadEl && autoReadEl.checked ? '1' : '0');
    var timeEl = document.getElementById('set-show-time');
    var confEl = document.getElementById('set-confirm-del');
    var compactEl = document.getElementById('set-compact-sb');
    var motionEl = document.getElementById('set-reduce-motion');
    var docsEl = document.getElementById('set-use-docs');
    var ephEl = document.getElementById('set-ephemeral');
    localStorage.setItem('ta_show_time', timeEl && timeEl.checked ? '1' : '0');
    localStorage.setItem('ta_confirm_del', confEl && confEl.checked ? '1' : '0');
    localStorage.setItem('ta_compact_sb', compactEl && compactEl.checked ? '1' : '0');
    localStorage.setItem('ta_reduce_motion', motionEl && motionEl.checked ? '1' : '0');
    localStorage.setItem('ta_use_docs', docsEl && docsEl.checked ? '1' : '0');
    localStorage.setItem('ta_ephemeral', ephEl && ephEl.checked ? '1' : '0');
    var modelSel = document.getElementById('set-default-model');
    if (modelSel && modelSel.value) setModel(modelSel.value);
    applyAppearance();
    if (ephEl && ephEl.checked) saveChats();
    if (autoEl) isWebSearch = !!autoEl.checked;
    var webBtn = document.getElementById('web-search-pill');
    if (webBtn) { if (isWebSearch) webBtn.classList.add('active'); else webBtn.classList.remove('active'); }
    if (currentUser && authToken) {
      try {
        var res = await fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({
            name: (document.getElementById('set-display-name') || {}).value,
            notifyProduct: !!(document.getElementById('set-notify-product') || {}).checked,
            notifySecurity: !!(document.getElementById('set-notify-security') || {}).checked,
            notifyDigest: !!(document.getElementById('set-notify-digest') || {}).checked,
            locale: (window.TA && TA.lang) ? TA.lang() : 'es'
          })
        });
        var data = await res.json();
        if (res.ok && data.user) {
          currentUser = data.user;
          localStorage.setItem('trujillo_ai_user', JSON.stringify(currentUser));
        }
      } catch (e) {}
    }
    updateUserUI();
    var st = document.getElementById('settings-status');
    if (st) { st.textContent = t('saved'); st.style.display = 'block'; }
    setTimeout(function() { closeModal('modal-settings'); }, 500);
  }
  async function changePasswordFromSettings() {
    if (!authToken) return;
    var cur = (document.getElementById('set-cur-pass') || {}).value || '';
    var neu = (document.getElementById('set-new-pass') || {}).value || '';
    if (neu.length < 6) return alert(t('newPassword'));
    try {
      var res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
        body: JSON.stringify({ currentPassword: cur, newPassword: neu })
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || t('error'));
      document.getElementById('set-cur-pass').value = '';
      document.getElementById('set-new-pass').value = '';
      var st = document.getElementById('settings-status');
      if (st) { st.textContent = t('saved'); st.style.display = 'block'; }
    } catch (err) { alert(err.message); }
  }
  async function deleteAccountFromSettings() {
    if (!authToken) return;
    if (!confirm(t('deleteConfirm'))) return;
    var oauthOnly = currentUser && !currentUser.hasPassword && currentUser.provider && currentUser.provider !== 'email';
    var pw = oauthOnly ? '' : (prompt(t('currentPassword')) || '');
    try {
      var res = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
        body: JSON.stringify({ password: pw })
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || t('error'));
      logout();
    } catch (err) { alert(err.message); }
  }
  function openProfileModal() {
    openSettingsModal('pane-account');
  }
  function logout() {
    authToken = ''; currentUser = null;
    localStorage.removeItem('trujillo_ai_token');
    localStorage.removeItem('trujillo_ai_user');
    updateUserUI();
    closeModal('modal-profile');
    closeModal('modal-settings');
  }
  function updateUserUI() {
    var nameEl = document.getElementById('user-display-name');
    var tierEl = document.getElementById('user-display-tier');
    var topText = document.getElementById('topbar-auth-text');
    var letter = document.getElementById('user-letter');
    var topLetter = document.getElementById('topbar-letter');
    var topBtn = document.getElementById('topbar-auth-btn');
    if (currentUser && authToken) {
      var name = currentUser.name || currentUser.email;
      if (nameEl) nameEl.textContent = name;
      if (tierEl) tierEl.textContent = currentUser.tier === 'enterprise' ? 'Enterprise' : t('verified');
      if (topText) topText.textContent = name.split(' ')[0];
      if (letter) letter.textContent = (name[0] || 'T').toUpperCase();
      if (topLetter) { topLetter.hidden = false; topLetter.textContent = (name[0] || 'T').toUpperCase(); }
      if (topBtn) { topBtn.classList.remove('primary'); topBtn.classList.add('topbar-user-btn'); }
      var navOut = document.getElementById('nav-logout-btn');
      if (navOut) navOut.hidden = false;
    } else {
      var byok = localStorage.getItem('ta_custom_key');
      if (byok) {
        if (nameEl) nameEl.textContent = 'BYOK';
        if (tierEl) tierEl.textContent = t('unlimited');
        if (topText) topText.textContent = 'BYOK';
      } else {
        if (nameEl) nameEl.textContent = t('guest');
        if (tierEl) tierEl.textContent = t('tokensDay');
        if (topText) topText.textContent = t('access');
      }
      if (letter) letter.textContent = 'T';
      if (topLetter) topLetter.hidden = true;
      if (topBtn) { topBtn.classList.add('primary'); topBtn.classList.remove('topbar-user-btn'); }
      var navOut2 = document.getElementById('nav-logout-btn');
      if (navOut2) navOut2.hidden = true;
    }
  }

  function openConnectorsModal() { renderCustomConnectors(); openModal('modal-connectors'); }
  function renderCustomConnectors() {
    var box = document.getElementById('custom-conn-list');
    if (!box) return;
    if (!customConnectors.length) { box.innerHTML = '<div class="empty-side">Sin webhooks propios.</div>'; return; }
    box.innerHTML = customConnectors.map(function(c, i) {
      return '<div class="connector-card" style="padding:8px 10px"><div class="connector-info"><div class="connector-name">' + escapeHtml(c.name) + '</div>' +
        '<div class="connector-desc" style="font-family:var(--mono)">' + escapeHtml(c.url) + '</div></div>' +
        '<button data-del-conn-idx="' + i + '" class="del-conn-btn mini-x" style="opacity:1" type="button">✕</button></div>';
    }).join('');
  }
  function addCustomConnector() {
    var nameEl = document.getElementById('custom-conn-name');
    var urlEl = document.getElementById('custom-conn-url');
    var name = nameEl ? nameEl.value.trim() : '';
    var url = urlEl ? urlEl.value.trim() : '';
    if (!name || !url) return alert('Nombre y URL.');
    customConnectors.push({ name: name, url: url, active: true });
    try { localStorage.setItem('ta_connectors', JSON.stringify(customConnectors)); } catch(e) {}
    if (nameEl) nameEl.value = '';
    if (urlEl) urlEl.value = '';
    renderCustomConnectors();
  }
  function deleteConnector(idx) {
    customConnectors.splice(idx, 1);
    try { localStorage.setItem('ta_connectors', JSON.stringify(customConnectors)); } catch(e) {}
    renderCustomConnectors();
  }

  function openKnowledgeModal() { renderKnowledgeList(); openModal('modal-knowledge'); }
  function renderKnowledgeList() {
    var count = document.getElementById('knowledge-count');
    var box = document.getElementById('knowledge-list-box');
    if (count) count.textContent = documents.length;
    if (!box) return;
    if (!documents.length) { box.innerHTML = '<div class="empty-side">Sin documentos.</div>'; return; }
    box.innerHTML = documents.map(function(item) {
      return '<div style="background:var(--elev);border:1px solid var(--line);padding:6px 8px;border-radius:8px;display:flex;justify-content:space-between;gap:8px">' +
        '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:0.75rem">' + escapeHtml(item.title) + '</div>' +
        '<button data-del-doc="' + item.id + '" class="del-rag-item-btn mini-x" style="opacity:1" type="button">✕</button></div>';
    }).join('');
  }
  function saveKnowledge() {
    var titleEl = document.getElementById('train-title');
    var contentEl = document.getElementById('train-content');
    var title = titleEl ? titleEl.value.trim() : '';
    var content = contentEl ? contentEl.value.trim() : '';
    if (!content) return alert('Introduce contenido.');
    addDocument({ title: title || 'Nota', content: content, type: 'note' });
    if (titleEl) titleEl.value = '';
    if (contentEl) contentEl.value = '';
    renderKnowledgeList();
    renderSidebar();
  }
  function deleteKnowledgeById(id) {
    documents = documents.filter(function(d) { return d.id !== id; });
    saveDocuments();
    renderKnowledgeList();
    renderSidebar();
  }
  function clearAllKnowledge() {
    if (!confirm(t('confirmClear'))) return;
    documents = [];
    saveDocuments();
    renderKnowledgeList();
    renderSidebar();
  }
  async function handleImportKnowledge(e) {
    var files = e.target.files;
    if (!files || !files.length) return;
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (f.size > 200000) continue;
      var txt = await f.text();
      addDocument({ title: f.name.replace(/\.[^/.]+$/, ''), content: txt.slice(0, 8000), type: 'upload' });
    }
    e.target.value = '';
    renderKnowledgeList();
    renderSidebar();
  }

  async function openShareModal() {
    var chat = chats[currentChatId];
    if (!chat || !Array.isArray(chat.messages) || !chat.messages.length) return alert('No hay mensajes para compartir.');
    var input = document.getElementById('share-link-input');
    var toast = document.getElementById('share-toast');
    if (input) input.value = 'Generando enlace…';
    if (toast) toast.style.display = 'none';
    openModal('modal-share');
    try {
      var modelEl = document.getElementById('model-select');
      var res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: chat.title || 'Conversación en Trujillo AI', messages: chat.messages, model: modelEl ? modelEl.value : 'openai/gpt-oss-120b' })
      });
      var d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || 'Error');
      if (input) { input.value = d.shareUrl; input.select(); }
      await navigator.clipboard.writeText(d.shareUrl).catch(function() {});
      if (toast) toast.style.display = 'block';
    } catch(e) {
      if (input) input.value = 'Error al generar enlace';
    }
  }
  function copyShareLink() {
    var input = document.getElementById('share-link-input');
    if (input && input.value && !input.value.startsWith('Error')) {
      navigator.clipboard.writeText(input.value);
      var toast = document.getElementById('share-toast');
      if (toast) toast.style.display = 'block';
      var btn = document.getElementById('share-copy-btn');
      if (btn) { btn.textContent = 'Copiado'; setTimeout(function() { btn.textContent = 'Copiar'; }, 1800); }
    }
  }

  async function loadSharedIfNeeded() {
    var m = location.pathname.match(/^\/share\/([^/]+)/);
    if (!m) return;
    try {
      var res = await fetch('/api/share/' + encodeURIComponent(m[1]));
      var d = await res.json();
      if (d.ok && d.chat) {
        shareReadOnly = true;
        currentChatId = 'shared_' + m[1];
        chats[currentChatId] = { title: d.chat.title || 'Compartida', messages: d.chat.messages || [], readOnly: true };
        loadChatView();
        var inp = document.getElementById('prompt-input');
        if (inp) { inp.disabled = true; inp.placeholder = 'Conversación compartida (solo lectura)'; }
      }
    } catch(e) {}
  }

  function initApp() {
    try {
      setLengthMode(currentLength);
      fillLangSelect();
      renderModelPicker();
      applyI18n();
      if (isWebSearch) {
        var wsb = document.getElementById('web-search-pill');
        if (wsb) wsb.classList.add('active');
      }
      loadSharedIfNeeded();
    } catch(initErr) { console.error('Init error:', initErr); }

    var newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);
    var tempChatBtn = document.getElementById('temp-chat-btn');
    if (tempChatBtn) tempChatBtn.addEventListener('click', startTempChat);
    var cmdOpenBtn = document.getElementById('cmd-open-btn');
    if (cmdOpenBtn) cmdOpenBtn.addEventListener('click', openCommandPalette);
    var cmdOverlay = document.getElementById('cmd-overlay');
    if (cmdOverlay) cmdOverlay.addEventListener('click', function(e) { if (e.target === cmdOverlay) closeCommandPalette(); });
    var cmdInput = document.getElementById('cmd-input');
    if (cmdInput) {
      cmdInput.addEventListener('input', function() { renderCommandPalette(this.value); });
      cmdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { e.preventDefault(); closeCommandPalette(); }
        if (e.key === 'Enter') {
          e.preventDefault();
          var first = document.querySelector('#cmd-list .cmd-item');
          if (first) first.click();
        }
      });
    }
    updateTempBadge();
    var historySearch = document.getElementById('history-search');
    if (historySearch) historySearch.addEventListener('input', function() { renderSidebar(this.value.trim()); });
    var sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', function() { toggleSidebar(true); });
    var sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', function() { toggleSidebar(false); });
    var sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', function() { toggleSidebar(false); });
    document.querySelectorAll('.sb-tab').forEach(function(t) {
      t.addEventListener('click', function() { setSidebarView(this.getAttribute('data-view')); });
    });
    document.addEventListener('click', function(e) {
      var n = e.target && e.target.closest ? e.target.closest('[data-open-settings]') : null;
      if (!n) return;
      e.preventDefault();
      var tab = n.getAttribute('data-open-settings') || 'pane-general';
      if (n.id === 'topbar-auth-btn' && !(currentUser && authToken)) {
        window.location.href = '/login';
        return;
      }
      openSettingsModal(tab);
    });
    var openConnectorsBtn = document.getElementById('open-connectors-btn');
    if (openConnectorsBtn) openConnectorsBtn.addEventListener('click', openConnectorsModal);
    var quickConnectorsPill = document.getElementById('quick-connectors-pill');
    if (quickConnectorsPill) quickConnectorsPill.addEventListener('click', openConnectorsModal);
    var openShareBtn = document.getElementById('open-share-btn');
    if (openShareBtn) openShareBtn.addEventListener('click', openShareModal);
    var sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.addEventListener('click', function() {
      if (isGenerating) abortGeneration();
      else handleSend();
    });
    var exportBtn = document.getElementById('export-chat-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportChat);
    var pickerBtn = document.getElementById('model-picker-btn');
    var picker = document.getElementById('model-picker');
    if (pickerBtn && picker) {
      pickerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var open = picker.classList.toggle('open');
        pickerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    var promptInput = document.getElementById('prompt-input');
    if (promptInput) {
      promptInput.addEventListener('keydown', function(e) {
        var enterSends = localStorage.getItem('ta_enter_send') !== '0';
        if (e.key === 'Enter' && !e.shiftKey) {
          if (enterSends && !e.ctrlKey && !e.metaKey) { e.preventDefault(); handleSend(); }
          else if (!enterSends && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSend(); }
        }
      });
      promptInput.addEventListener('input', function() { autoResize(this); });
    }
    var webSearchPill = document.getElementById('web-search-pill');
    if (webSearchPill) webSearchPill.addEventListener('click', toggleWebSearch);
    var imageGenPill = document.getElementById('image-gen-pill');
    if (imageGenPill) imageGenPill.addEventListener('click', toggleImageMode);
    var attachFileBtn = document.getElementById('attach-file-btn');
    var fileUploader = document.getElementById('file-uploader');
    if (attachFileBtn && fileUploader) {
      attachFileBtn.addEventListener('click', function() { fileUploader.click(); });
      fileUploader.addEventListener('change', handleFileUpload);
    }
    var removeFileBtn = document.getElementById('remove-file-btn');
    if (removeFileBtn) removeFileBtn.addEventListener('click', removeAttachedFile);
    var micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.addEventListener('click', toggleSpeech);
    var speakLastBtn = document.getElementById('speak-last-btn');
    if (speakLastBtn) speakLastBtn.addEventListener('click', speakLastReply);
    var ideaSend = document.getElementById('idea-send-btn');
    if (ideaSend) ideaSend.addEventListener('click', submitIdea);
    document.querySelectorAll('[data-idea-cat]').forEach(function(b) {
      b.addEventListener('click', function() {
        ideaCat = b.getAttribute('data-idea-cat') || 'feat';
        document.querySelectorAll('[data-idea-cat]').forEach(function(x) { x.classList.toggle('active', x === b); });
      });
    });
    var openIdeas = document.getElementById('open-ideas-btn');
    if (openIdeas) openIdeas.addEventListener('click', function() { openSettingsModal('pane-ideas'); });
    var adaptToggle = document.getElementById('set-adapt');
    if (adaptToggle) adaptToggle.addEventListener('change', function() {
      localStorage.setItem('ta_adapt', this.checked ? '1' : '0');
      postProfile({ enabled: this.checked });
    });
    var adaptAddBtn = document.getElementById('adapt-note-btn');
    if (adaptAddBtn) adaptAddBtn.addEventListener('click', function() {
      var inp = document.getElementById('adapt-note-input');
      var text = inp ? inp.value.trim() : '';
      if (text.length < 8) return;
      postProfile({ note: text }).then(function() { if (inp) inp.value = ''; });
    });
    var adaptForget = document.getElementById('adapt-forget-btn');
    if (adaptForget) adaptForget.addEventListener('click', function() {
      if (!confirm(t('adaptForget'))) return;
      postProfile({ forgetAll: true });
      saveLocalProfile(emptyLocalProfile());
      renderAdaptPane();
    });
    var adaptNotes = document.getElementById('adapt-notes');
    if (adaptNotes) adaptNotes.addEventListener('click', function(e) {
      var id = e.target && e.target.getAttribute('data-del-note');
      if (!id) return;
      postProfile({ deleteNoteId: id });
    });
    var autoReadLive = document.getElementById('set-auto-read');
    if (autoReadLive) autoReadLive.addEventListener('change', function() {
      localStorage.setItem('ta_auto_read', this.checked ? '1' : '0');
    });
    var capsule = document.querySelector('.capsule-box');
    if (capsule) {
      ;['dragenter', 'dragover'].forEach(function(ev) {
        capsule.addEventListener(ev, function(e) { e.preventDefault(); capsule.classList.add('drag-over'); });
      });
      ;['dragleave', 'drop'].forEach(function(ev) {
        capsule.addEventListener(ev, function(e) { e.preventDefault(); capsule.classList.remove('drag-over'); });
      });
      capsule.addEventListener('drop', function(e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) attachDroppedFile(f);
      });
      capsule.addEventListener('paste', function(e) {
        var items = e.clipboardData && e.clipboardData.items;
        if (!items) return;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') === 0) {
            var f = items[i].getAsFile();
            if (f) { e.preventDefault(); attachDroppedFile(f); }
            break;
          }
        }
      });
    }
    var saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);
    document.querySelectorAll('.settings-nav-btn[data-pane]').forEach(function(btn) {
      btn.addEventListener('click', function() { showSettingsPane(this.getAttribute('data-pane')); });
    });
    document.querySelectorAll('.choice-pill[data-pref], .theme-card[data-pref], .accent-dot[data-pref]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var pref = btn.getAttribute('data-pref');
        var val = btn.getAttribute('data-value');
        localStorage.setItem(pref, val);
        setChoice(pref, val);
        if (pref === 'ta_theme' || pref === 'ta_font' || pref === 'ta_accent') applyAppearance();
        if (pref === 'ta_len_mode') setLengthMode(val);
      });
    });
    var compactEl = document.getElementById('set-compact-sb');
    if (compactEl) compactEl.addEventListener('change', function() {
      localStorage.setItem('ta_compact_sb', this.checked ? '1' : '0');
      applyAppearance();
    });
    var motionEl = document.getElementById('set-reduce-motion');
    if (motionEl) motionEl.addEventListener('change', function() {
      localStorage.setItem('ta_reduce_motion', this.checked ? '1' : '0');
      applyAppearance();
    });
    function doLogout() {
      if (!confirm(t('logoutConfirm'))) return;
      logout();
    }
    var settingsLogout = document.getElementById('settings-logout-btn');
    if (settingsLogout) settingsLogout.addEventListener('click', doLogout);
    var navLogout = document.getElementById('nav-logout-btn');
    if (navLogout) navLogout.addEventListener('click', doLogout);
    var exportBtnAll = document.getElementById('btn-export-all');
    if (exportBtnAll) exportBtnAll.addEventListener('click', function() {
      var payload = { exportedAt: new Date().toISOString(), chats: chats, documents: documents, projects: projects };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'trujillo-ai-export.json';
      a.click();
      var st = document.getElementById('settings-status');
      if (st) { st.textContent = t('exportOk'); st.style.display = 'block'; }
    });
    var clearChatsBtn = document.getElementById('btn-clear-chats');
    if (clearChatsBtn) clearChatsBtn.addEventListener('click', function() {
      if (!confirm(t('clearChatsConfirm'))) return;
      chats = {};
      saveChats();
      startNewChat();
      var st = document.getElementById('settings-status');
      if (st) { st.textContent = t('clearChatsOk'); st.style.display = 'block'; }
    });
    var clearDocsBtn = document.getElementById('btn-clear-docs');
    if (clearDocsBtn) clearDocsBtn.addEventListener('click', clearAllKnowledge);
    var changePassBtn = document.getElementById('change-pass-btn');
    if (changePassBtn) changePassBtn.addEventListener('click', changePasswordFromSettings);
    var delAccBtn = document.getElementById('delete-account-btn');
    if (delAccBtn) delAccBtn.addEventListener('click', deleteAccountFromSettings);
    var testEmailBtn = document.getElementById('test-email-btn');
    if (testEmailBtn) testEmailBtn.addEventListener('click', async function() {
      if (!authToken) return;
      try {
        var res = await fetch('/api/auth/test-email', { method: 'POST', headers: { 'Authorization': 'Bearer ' + authToken } });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || t('error'));
        var st = document.getElementById('settings-status');
        if (st) { st.textContent = t('testEmailOk'); st.style.display = 'block'; }
      } catch (err) { alert(err.message); }
    });
    var saveKnowledgeBtn = document.getElementById('save-knowledge-btn');
    if (saveKnowledgeBtn) saveKnowledgeBtn.addEventListener('click', saveKnowledge);
    var clearRagBtn = document.getElementById('clear-rag-btn');
    if (clearRagBtn) clearRagBtn.addEventListener('click', clearAllKnowledge);
    var importRagFile = document.getElementById('import-rag-file');
    if (importRagFile) importRagFile.addEventListener('change', handleImportKnowledge);
    var importDocsBtn = document.getElementById('import-docs-btn');
    if (importDocsBtn && importRagFile) importDocsBtn.addEventListener('click', function() { importRagFile.click(); });
    var addCustomConnBtn = document.getElementById('add-custom-conn-btn');
    if (addCustomConnBtn) addCustomConnBtn.addEventListener('click', addCustomConnector);
    var shareCopyBtn = document.getElementById('share-copy-btn');
    if (shareCopyBtn) shareCopyBtn.addEventListener('click', copyShareLink);
    document.getElementById('art-close-btn').addEventListener('click', closeArtifact);
    document.getElementById('art-copy-btn').addEventListener('click', function() {
      if (currentArtifact) navigator.clipboard.writeText(currentArtifact.content || '');
    });
    document.getElementById('art-save-btn').addEventListener('click', function() {
      if (!currentArtifact) return;
      addDocument({ title: currentArtifact.title, content: currentArtifact.content, type: 'artifact', lang: currentArtifact.lang });
      renderSidebar();
    });
    document.querySelectorAll('.length-opt-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { var mode = this.getAttribute('data-len'); if (mode) setLengthMode(mode); });
    });
    document.addEventListener('click', function(e) {
      var modelOpt = e.target.closest('.model-option');
      if (modelOpt) { setModel(modelOpt.getAttribute('data-model')); return; }
      var pickerEl = document.getElementById('model-picker');
      if (pickerEl && !pickerEl.contains(e.target)) pickerEl.classList.remove('open');
      if (e.target && e.target.id === 'clear-project-filter') { currentProjectId = null; renderSidebar(); return; }
      if (e.target && e.target.id === 'toggle-archived') { showArchived = !showArchived; renderSidebar(); return; }
      var closeBtn = e.target.closest('[data-modal]');
      if (closeBtn && closeBtn.tagName === 'BUTTON') { var mId = closeBtn.getAttribute('data-modal'); if (mId) closeModal(mId); return; }
      if (e.target && e.target.id === 'logout-btn') { logout(); return; }
      var chipBtn = e.target.closest('.hero-chip');
      if (chipBtn) { var p = chipBtn.getAttribute('data-prompt'); if (p) sendQuick(p); return; }
      var imgEl = e.target.closest('.ai-image-img');
      if (imgEl) { var u = imgEl.getAttribute('data-img-url'); if (u) window.open(u, '_blank'); return; }
      var codeCopy = e.target.closest('.code-copy-btn');
      if (codeCopy) {
        navigator.clipboard.writeText(decodeURIComponent(codeCopy.getAttribute('data-code') || '')).then(function() {
          codeCopy.textContent = 'Copiado';
          setTimeout(function() { codeCopy.textContent = 'Copiar'; }, 1800);
        }).catch(function() {});
        return;
      }
      var delRag = e.target.closest('.del-rag-item-btn');
      if (delRag) { var id = delRag.getAttribute('data-del-doc'); if (id) deleteKnowledgeById(id); return; }
      var delConn = e.target.closest('.del-conn-btn');
      if (delConn) { var cIdx = parseInt(delConn.getAttribute('data-del-conn-idx'), 10); if (!isNaN(cIdx)) deleteConnector(cIdx); return; }
      var chip = e.target.closest('.cashtag-chip');
      if (chip) { var sym = chip.getAttribute('data-sym'); if (sym) showCashtagQuote(sym, chip); return; }
      if (!e.target.closest('.cashtag-chip')) document.querySelectorAll('.cashtag-popover').forEach(function(p) { p.remove(); });
    });
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === ',') { e.preventDefault(); openSettingsModal('pane-general'); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); openCommandPalette(); return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') { e.preventDefault(); startTempChat(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); startNewChat(); }
      if (e.key === 'Escape') {
        closeCommandPalette();
        closeArtifact();
        var p = document.getElementById('model-picker');
        if (p) p.classList.remove('open');
        if (isGenerating) abortGeneration();
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        var pi = document.getElementById('prompt-input');
        if (pi) pi.focus();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
  else initApp();
})();
