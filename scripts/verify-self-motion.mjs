import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Elementar-Chemie-Abenteuer.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const shotFrame1 = path.join(artifactDir, 'screenshot_motion_frame1.png');
const shotFrame2 = path.join(artifactDir, 'screenshot_motion_frame2.png');

console.log('Starte Headless Chrome für Verifikation der selbstständigen Bewegung...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9243',
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
    const listRes = await fetch('http://127.0.0.1:9243/json');
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
        await sleep(500);

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
        await sleep(500);

        // Frame 1 aufnehmen (ohne Interaktion!)
        await screenshot(shotFrame1);

        // 1500 ms warten - rein passive Beobachtung (kein Gedrückthalten!)
        await sleep(1500);

        // Frame 2 aufnehmen
        await screenshot(shotFrame2);

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
