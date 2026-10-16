import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html nicht gefunden!');
  process.exit(1);
}

let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Find CSS file
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (cssFile) {
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  html = html.replace(
    new RegExp(`<link rel="stylesheet" crossorigin href="\\./assets/${cssFile}">`),
    `<style>\n${cssContent}\n</style>`
  );
}

if (jsFile) {
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  // Remove module script and insert plain script
  html = html.replace(
    new RegExp(`<script type="module" crossorigin src="\\./assets/${jsFile}"></script>`),
    `<script>\n${jsContent}\n</script>`
  );
}

// Write Chemistry-Mystery.html in chemi directory and in parent AITarek directory
const outPathChemi = path.resolve('Chemistry-Mystery.html');
const outPathParent = path.resolve('..', 'Chemistry-Mystery.html');

fs.writeFileSync(outPathChemi, html, 'utf8');
fs.writeFileSync(outPathParent, html, 'utf8');

console.log('Erfolgreich erstellt:');
console.log('-', outPathChemi);
console.log('-', outPathParent);
