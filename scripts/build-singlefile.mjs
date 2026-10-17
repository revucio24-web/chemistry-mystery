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

// Inline icon.svg if available
const iconSvgPath = path.join('public', 'icon.svg');
if (fs.existsSync(iconSvgPath)) {
  const svgContent = fs.readFileSync(iconSvgPath, 'utf8');
  const svgBase64 = Buffer.from(svgContent).toString('base64');
  const dataUri = `data:image/svg+xml;base64,${svgBase64}`;
  html = html.replace(/href="\.\/icon\.svg"/g, () => `href="${dataUri}"`);
}

// Find CSS and JS files
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

if (cssFile) {
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  // Use function callback so $&, $', $1 in CSS is never interpreted as regex replacement pattern
  html = html.replace(
    new RegExp(`<link rel="stylesheet"[^>]*href="\\./assets/${cssFile}">`),
    () => `<style>\n${cssContent}\n</style>`
  );
}

if (jsFile) {
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  // Remove module script from head
  html = html.replace(
    new RegExp(`<script type="module"[^>]*src="\\./assets/${jsFile}"></script>`),
    ''
  );
  
  // Escape any </script in the JS to prevent HTML parser from terminating the script tag
  const safeJs = jsContent.replace(/<\/script/gi, '<\\/script');
  
  // Append script at the end of body so DOM elements (like #root) exist before execution
  html = html.replace('</body>', () => `<script>\n${safeJs}\n</script>\n</body>`);
}

// Write Elementar-Chemie-Abenteuer.html & Elementar.html & Chemistry-Mystery.html
const outTargets = [
  path.resolve('Elementar-Chemie-Abenteuer.html'),
  path.resolve('..', 'Elementar-Chemie-Abenteuer.html'),
  path.resolve('..', 'Elementar.html'),
  path.resolve('Chemistry-Mystery.html'),
  path.resolve('..', 'Chemistry-Mystery.html')
];

for (const target of outTargets) {
  fs.writeFileSync(target, html, 'utf8');
}

console.log('Erfolgreich fehlerfrei als Single-File HTML erstellt:');
outTargets.forEach(t => console.log('-', t));
