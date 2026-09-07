const fs = require('fs');

let css = fs.readFileSync('public/assets/app.css', 'utf8');

// Update color-scheme
css = css.replace(/html\[data-theme="sepia"\] \{ color-scheme: light; \}/, 'html[data-theme="sepia"], html[data-theme="rose"], html[data-theme="lavender"] { color-scheme: light; }');

// Add 7 themes before data-font
const newThemes = `
    html[data-theme="hacker"] { --bg: #000; --sidebar: #050505; --elev: #0a0a0a; --elev-2: #121212; --card: #080808; --input: #000; --invert: #0f0; --invert-fg: #000; --line: rgba(0,255,0,0.2); --line-2: rgba(0,255,0,0.3); --text: #0f0; --muted: #0a0; --dim: #050; }
    html[data-theme="cyberpunk"] { --bg: #120421; --sidebar: #0c0216; --elev: #1f0b38; --elev-2: #2d1354; --card: #160629; --input: #0c0216; --invert: #fcee0a; --invert-fg: #120421; --line: rgba(255,0,127,0.3); --line-2: rgba(255,0,127,0.5); --text: #0ff; --muted: #ff007f; --dim: #8b008b; }
    html[data-theme="sunset"] { --bg: #2d1b2e; --sidebar: #1f1120; --elev: #3d243e; --elev-2: #4e2e4f; --card: #251426; --input: #1f1120; --invert: #f69d3c; --invert-fg: #2d1b2e; --line: rgba(246,157,60,0.2); --line-2: rgba(246,157,60,0.3); --text: #f69d3c; --muted: #b86b25; --dim: #7a4618; }
    html[data-theme="ocean"] { --bg: #001f3f; --sidebar: #00152b; --elev: #002b5e; --elev-2: #003a7a; --card: #001a35; --input: #00152b; --invert: #39cccc; --invert-fg: #001f3f; --line: rgba(57,204,204,0.2); --line-2: rgba(57,204,204,0.3); --text: #39cccc; --muted: #2a9b9b; --dim: #1e6c6c; }
    html[data-theme="forest"] { --bg: #0f291e; --sidebar: #0a1c14; --elev: #15392a; --elev-2: #1c4b37; --card: #0c2118; --input: #0a1c14; --invert: #8fbc8f; --invert-fg: #0f291e; --line: rgba(143,188,143,0.2); --line-2: rgba(143,188,143,0.3); --text: #8fbc8f; --muted: #5e8a5e; --dim: #3d593d; }
    html[data-theme="rose"] { --bg: #fff0f5; --sidebar: #ffe4e1; --elev: #ffe4e1; --elev-2: #ffb6c1; --card: #fff0f5; --input: #ffe4e1; --invert: #db7093; --invert-fg: #fff0f5; --line: rgba(219,112,147,0.15); --line-2: rgba(219,112,147,0.25); --text: #db7093; --muted: #c71585; --dim: #8b0a50; }
    html[data-theme="lavender"] { --bg: #e6e6fa; --sidebar: #d8bfd8; --elev: #e6e6fa; --elev-2: #dda0dd; --card: #e6e6fa; --input: #d8bfd8; --invert: #663399; --invert-fg: #e6e6fa; --line: rgba(102,51,153,0.15); --line-2: rgba(102,51,153,0.25); --text: #663399; --muted: #8a2be2; --dim: #4b0082; }
`;
css = css.replace(/    html\[data-font="sm"\]/, newThemes + '    html[data-font="sm"]');

// Add swatches
const newSwatches = `
    .theme-swatch[data-swatch="hacker"] { --sw-bg: #000; --sw-side: #050505; }
    .theme-swatch[data-swatch="cyberpunk"] { --sw-bg: #120421; --sw-side: #0c0216; }
    .theme-swatch[data-swatch="sunset"] { --sw-bg: #2d1b2e; --sw-side: #1f1120; }
    .theme-swatch[data-swatch="ocean"] { --sw-bg: #001f3f; --sw-side: #00152b; }
    .theme-swatch[data-swatch="forest"] { --sw-bg: #0f291e; --sw-side: #0a1c14; }
    .theme-swatch[data-swatch="rose"] { --sw-bg: #fff0f5; --sw-side: #ffe4e1; }
    .theme-swatch[data-swatch="lavender"] { --sw-bg: #e6e6fa; --sw-side: #d8bfd8; }
`;
css = css.replace(/    \.accent-row/, newSwatches + '    .accent-row');

fs.writeFileSync('public/assets/app.css', css);

let appJs = fs.readFileSync('public/assets/app.js', 'utf8');

// Add the 7 themes to THEME_COLORS
appJs = appJs.replace(
  "sepia: '#fdf6e3' };",
  "sepia: '#fdf6e3', hacker: '#000000', cyberpunk: '#120421', sunset: '#2d1b2e', ocean: '#001f3f', forest: '#0f291e', rose: '#fff0f5', lavender: '#e6e6fa' };"
);

// Add the 7 buttons to the DOM
const endMarker = '<button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"system\\">';
const newButtons = `              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"hacker\\"><span class=\\"theme-swatch\\" data-swatch=\\"hacker\\"></span><span data-i18n=\\"themeHacker\\">Hacker</span></button>\\n              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"cyberpunk\\"><span class=\\"theme-swatch\\" data-swatch=\\"cyberpunk\\"></span><span data-i18n=\\"themeCyberpunk\\">Cyberpunk</span></button>\\n              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"sunset\\"><span class=\\"theme-swatch\\" data-swatch=\\"sunset\\"></span><span data-i18n=\\"themeSunset\\">Sunset</span></button>\\n              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"ocean\\"><span class=\\"theme-swatch\\" data-swatch=\\"ocean\\"></span><span data-i18n=\\"themeOcean\\">Ocean</span></button>\\n              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"forest\\"><span class=\\"theme-swatch\\" data-swatch=\\"forest\\"></span><span data-i18n=\\"themeForest\\">Forest</span></button>\\n              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"rose\\"><span class=\\"theme-swatch\\" data-swatch=\\"rose\\"></span><span data-i18n=\\"themeRose\\">Rose</span></button>\\n              <button type=\\"button\\" class=\\"theme-card\\" data-pref=\\"ta_theme\\" data-value=\\"lavender\\"><span class=\\"theme-swatch\\" data-swatch=\\"lavender\\"></span><span data-i18n=\\"themeLavender\\">Lavender</span></button>\\n              `;
appJs = appJs.replace(endMarker, newButtons + endMarker);

fs.writeFileSync('public/assets/app.js', appJs);
console.log('Themes added!');
