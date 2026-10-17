import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Elementar-Chemie-Abenteuer.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const outScreenshot = path.join(artifactDir, 'screenshot_pse_authentic_details.png');

console.log('Starte Headless Chrome für Detailansicht wahre Kennzahlen...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--window-size=1440,960',
  '--disable-gpu',
  '--no-sandbox',
  fileUrl
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9231/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('Kein Tab gefunden');

    const wsUrl = pageTab.webSocketDebuggerUrl;
    const WebSocket = (await import('ws')).default || (await import('ws'));
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      const clickScript = `
        const pseBtn = Array.from(document.querySelectorAll('button')).find(b => 
          b.innerText.includes('Periodensystem') || 
          b.title?.includes('Periodensystem') ||
          b.getAttribute('aria-label')?.includes('Periodensystem')
        );
        if (pseBtn) pseBtn.click();

        setTimeout(() => {
          // Klicke auf Element 26 (Eisen - Fe)
          const elements = Array.from(document.querySelectorAll('div, button'));
          const feEl = elements.find(el => el.innerText && el.innerText.trim().startsWith('26') && el.innerText.includes('Fe'));
          if (feEl) feEl.click();

          // Scrolle die rechte Infoleiste nach unten
          setTimeout(() => {
            const sidebars = document.querySelectorAll('div.overflow-y-auto');
            sidebars.forEach(s => {
              s.scrollTop = 420;
            });
          }, 300);
        }, 500);
      `;

      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: clickScript } }));

      setTimeout(() => {
        ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1600);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 2 && msg.result && msg.result.data) {
        fs.writeFileSync(outScreenshot, Buffer.from(msg.result.data, 'base64'));
        console.log('Screenshot erfolgreich gespeichert:', outScreenshot);
        ws.close();
        chrome.kill();
        process.exit(0);
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket Fehler:', err);
      chrome.kill();
      process.exit(1);
    });

  } catch (err) {
    console.error('Fehler bei Chrome-Verbindung:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
