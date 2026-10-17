import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Elementar-Chemie-Abenteuer.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const shotIron3D = path.join(artifactDir, 'screenshot_atom_3d_iron.png');
const shotGold3D = path.join(artifactDir, 'screenshot_atom_3d_gold.png');
const shotMicrocosm3D = path.join(artifactDir, 'screenshot_atom_3d_microcosm_stage2.png');

console.log('Starte Headless Chrome für Verifikation des 3D-Atommodells...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9242',
  '--window-size=1440,960',
  '--disable-gpu',
  '--no-sandbox',
  fileUrl
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9242/json');
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
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      console.log('Screenshot gespeichert:', filePath);
    }

    ws.on('open', async () => {
      try {
        await sleep(600);

        // 1. Öffne Periodensystem
        await evaluate(`(() => {
          const pseBtn = Array.from(document.querySelectorAll('button')).find(b => 
            b.innerText.includes('Periodensystem') || 
            b.title?.includes('Periodensystem')
          );
          if (pseBtn) pseBtn.click();
        })()`);
        await sleep(600);

        // 2. Klicke auf Eisen (Fe, Z=26)
        await evaluate(`(() => {
          const feEl = document.querySelector('[title*="Eisen (Fe, Z=26"]');
          if (feEl) feEl.click();
        })()`);
        await sleep(600);
        await screenshot(shotIron3D);

        // 3. Klicke auf Gold (Au, Z=79)
        await evaluate(`(() => {
          const auEl = document.querySelector('[title*="Gold (Au, Z=79"]');
          if (auEl) auEl.click();
        })()`);
        await sleep(600);
        await screenshot(shotGold3D);

        // 4. Klicke zurück auf Eisen und öffne Mikrokosmos-Zoom
        await evaluate(`(() => {
          const feEl = document.querySelector('[title*="Eisen (Fe, Z=26"]');
          if (feEl) feEl.click();
        })()`);
        await sleep(300);

        await evaluate(`(() => {
          const zoomBtn = Array.from(document.querySelectorAll('button')).find(b => 
            b.innerText.includes('Atomkern zoomen') || 
            b.innerText.includes('Kern-Zoom')
          );
          if (zoomBtn) zoomBtn.click();
        })()`);
        await sleep(500);

        // Gehe auf Stufe 2 (Hülle & 3D Atom)
        await evaluate(`(() => {
          const btn = document.querySelector('button[data-zoom-stage="2"]');
          if (btn) btn.click();
        })()`);
        await sleep(800);
        await screenshot(shotMicrocosm3D);

        ws.close();
        chrome.kill();
        process.exit(0);
      } catch (err) {
        console.error('Ablauf-Fehler:', err);
        ws.close();
        chrome.kill();
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Fehler bei Chrome-Verbindung:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
