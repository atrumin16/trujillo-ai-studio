import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'src', 'web_decoded.html'), 'utf8');
const escaped = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const out = `import { avatarDataUri } from './avatar.js';
const rawHtml = \`${escaped}\`;
export const webHtml = rawHtml.replace(/__AVATAR_URI__/g, avatarDataUri);
`;
fs.writeFileSync(path.join(root, 'src', 'web.js'), out);
console.log('Wrote src/web.js (' + out.length + ' bytes)');
