// Prueft die GitHub-Pages-Deployment auf die Dinge, die PWABuilder braucht.
// Aufruf: node scripts/verify-pages.mjs [url]

const base = (process.argv[2] ?? 'https://revucio24-web.github.io/chemistry-mystery/').replace(/\/?$/, '/');

const targets = [
  ['HTML', ''],
  ['Manifest', 'manifest.webmanifest'],
  ['Service Worker', 'sw.js'],
  ['SW-Registrierung', 'registerSW.js'],
  ['Icon 192', 'icons/icon-192.png'],
  ['Icon 512', 'icons/icon-512.png'],
];

let failed = 0;

for (const [label, path] of targets) {
  const url = base + path;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const type = res.headers.get('content-type') ?? '-';
    const len = res.headers.get('content-length') ?? '?';
    const ok = res.ok;
    if (!ok) failed++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${label.padEnd(16)} ${res.status}  ${String(type).padEnd(24)} ${len} B`);
    if (path === 'manifest.webmanifest' && ok) {
      const m = await res.json();
      console.log(`     -> name="${m.name}" icons=${m.icons?.length ?? 0} start_url="${m.start_url}" display="${m.display}"`);
    }
    if (path === 'sw.js' && ok) {
      const sw = await res.text();
      const count = (sw.match(/revision/g) ?? []).length;
      console.log(`     -> ${sw.length} B, ${count} Precache-Einträge`);
    }
  } catch (err) {
    failed++;
    console.log(`FAIL ${label.padEnd(16)} ${err.message}`);
  }
}

console.log(failed === 0 ? '\nAlles erreichbar.' : `\n${failed} Fehler.`);
process.exit(failed === 0 ? 0 : 1);
