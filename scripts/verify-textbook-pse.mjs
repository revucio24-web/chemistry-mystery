import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Elementar-Chemie-Abenteuer.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const shotTextbookPse = path.join(artifactDir, 'screenshot_pse_textbook_sample_cell.png');
const shotFullscreenPse = path.join(artifactDir, 'screenshot_pse_fullscreen_table_only.png');

console.log('Starte Headless Chrome für Verifikation des Lehrbuch-Periodensystems...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9241',
  '--window-size=1680,1050',
  '--disable-gpu',
  '--no-sandbox',
  fileUrl
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9241/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('Kein Tab gefunden');

    const wsUrl = pageTab.webSocketDebuggerUrl;
    const WebSocket = (await import('ws')).default || (await import('ws'));
    const ws = new WebSocket(wsUrl);

    let nextId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        const handler = (data) => {
          const msg = JSON.parse(data.toString());
          if (msg.id === id) {
            ws.off('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(code) {
      return await sendCommand('Runtime.evaluate', { expression: code, returnByValue: true });
    }

    async function screenshot(filePath) {
      const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      fs.writeFileSync(filePath, buffer);
      console.log('Screenshot gespeichert:', filePath);
    }

    await new Promise(r => ws.on('open', r));
    await sleep(2000);

    // Klicke auf den "Periodensystem (PSE)"-Button in der Navigation
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pseBtn = btns.find(b => b.textContent && b.textContent.includes('Periodensystem'));
      if (pseBtn) pseBtn.click();
    })()`);
    await sleep(1500);

    // Screenshot 1: Normalansicht mit Lehrbuch-Musterzelle und Details-Sidebar
    await screenshot(shotTextbookPse);

    // Klicke auf "Nur Tabelle" (Sidebar einklappen) für maximale Übersicht
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const toggleBtn = btns.find(b => b.textContent && b.textContent.includes('Nur Tabelle'));
      if (toggleBtn) toggleBtn.click();
    })()`);
    await sleep(1000);

    // Screenshot 2: Maximale Tabellenbreite ohne Sidebar mit unterer Schnell-Leiste
    await screenshot(shotFullscreenPse);

    console.log('Verifikation erfolgreich abgeschlossen!');
  } catch (err) {
    console.error('Fehler bei der Verifikation:', err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}, 3000);
