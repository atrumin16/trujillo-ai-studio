const fs = require('fs');

const POPULAR_TZ = [
  "auto",
  "Europe/Madrid", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver",
  "America/Mexico_City", "America/Bogota", "America/Lima", "America/Santiago",
  "America/Buenos_Aires", "America/Sao_Paulo",
  "Asia/Tokyo", "Asia/Seoul", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore",
  "Asia/Kolkata", "Asia/Dubai", "Asia/Bangkok", "Asia/Jakarta", "Asia/Riyadh",
  "Asia/Tehran", "Asia/Kabul", "Asia/Karachi",
  "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth",
  "Pacific/Auckland", "Pacific/Fiji", "Pacific/Honolulu",
  "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi",
  "Europe/Moscow", "Europe/Istanbul", "Europe/Kiev", "Europe/Athens", "Europe/Lisbon",
  "Atlantic/Reykjavik", "America/Anchorage", "America/Caracas", "UTC"
];

let appJs = fs.readFileSync('public/assets/app.js', 'utf8');

// 1. Add the select to HTML
const targetHTML = '<div class=\\"form-group\\">\\n            <label class=\\"form-label\\" data-i18n=\\"setDefaultModel\\">Modelo por defecto</label>';
const newHTML = `<div class=\\"form-group\\">\\n            <label class=\\"form-label\\" data-i18n=\\"timezone\\">Zona Horaria</label>\\n            <select id=\\"set-timezone\\" class=\\"form-input\\"></select>\\n          </div>\\n          ` + targetHTML;
appJs = appJs.replace(targetHTML, newHTML);

// 2. Modify formatMsgTime
const oldFormatTime = `  function formatMsgTime(at) {
    var d = at ? new Date(at) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }`;
const newFormatTime = `  function formatMsgTime(at) {
    var d = at ? new Date(at) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    var tz = localStorage.getItem('ta_timezone');
    var opts = { hour: '2-digit', minute: '2-digit' };
    if (tz && tz !== 'auto') opts.timeZone = tz;
    try {
      return d.toLocaleTimeString([], opts);
    } catch(e) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }`;
appJs = appJs.replace(oldFormatTime, newFormatTime);

// 3. Populate select logic and event listener
// We can insert this right after setting up the default model select around line 1713
const oldModelSetup = `      }).join('');
    }`;
const newModelSetup = `      }).join('');
    }
    var tzSel = document.getElementById('set-timezone');
    if (tzSel) {
      var topTz = ["auto","Europe/Madrid","Europe/London","Europe/Paris","Europe/Berlin","Europe/Rome","America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Toronto","America/Vancouver","America/Mexico_City","America/Bogota","America/Lima","America/Santiago","America/Buenos_Aires","America/Sao_Paulo","Asia/Tokyo","Asia/Seoul","Asia/Shanghai","Asia/Hong_Kong","Asia/Singapore","Asia/Kolkata","Asia/Dubai","Asia/Bangkok","Asia/Jakarta","Asia/Riyadh","Africa/Cairo","Africa/Johannesburg","Africa/Lagos","Africa/Nairobi","Australia/Sydney","Australia/Melbourne","Pacific/Auckland","UTC"];
      var curTz = localStorage.getItem('ta_timezone') || 'auto';
      tzSel.innerHTML = topTz.map(function(t) {
        var label = t === 'auto' ? (window.TA && TA.t ? TA.t('tzAuto') || 'Automático (Sistema)' : 'Automático (Sistema)') : t.replace('_', ' ');
        return '<option value="' + t + '"' + (t === curTz ? ' selected' : '') + '>' + label + '</option>';
      }).join('');
      tzSel.addEventListener('change', function() {
        localStorage.setItem('ta_timezone', this.value);
        var times = document.querySelectorAll('.msg-time');
        // Times can't easily be retroactively updated without full re-render, but new ones will use it.
        // Actually, if we just reload the chat, it will re-render!
        if (currentChatId && chats[currentChatId]) loadChatView();
      });
    }`;
appJs = appJs.replace(oldModelSetup, newModelSetup);

fs.writeFileSync('public/assets/app.js', appJs);
console.log('Timezone logic added!');
