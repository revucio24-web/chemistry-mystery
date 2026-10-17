import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Elementar-Chemie-Abenteuer.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const shotStage2 = path.join(artifactDir, 'screenshot_nucleus_zoom_stage2.png');
const shotStage3 = path.join(artifactDir, 'screenshot_nucleus_zoom_stage3.png');
const shotStage4 = path.join(artifactDir, 'screenshot_nucleus_zoom_stage4.png');

console.log('Starte Headless Chrome für Verifikation der 4-Stufen Zoom-Reise...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9236',
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
    const listRes = await fetch('http://127.0.0.1:9236/json');
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
        await evaluate(`
          const pseBtn = Array.from(document.querySelectorAll('button')).find(b => 
            b.innerText.includes('Periodensystem') || 
            b.title?.includes('Periodensystem')
          );
          if (pseBtn) pseBtn.click();
        `);
        await sleep(500);

        // 2. Klicke auf Eisen (Fe)
        await evaluate(`
          const elements = Array.from(document.querySelectorAll('div, button'));
          const feEl = elements.find(el => el.innerText && el.innerText.trim().startsWith('26') && el.innerText.includes('Fe'));
          if (feEl) feEl.click();
        `);
        await sleep(400);

        // 3. Klicke auf Zoom-Button
        await evaluate(`
          const zoomBtn = Array.from(document.querySelectorAll('button')).find(b => 
            b.innerText.includes('Atomkern zoomen') || 
            b.innerText.includes('Kern-Zoom')
          );
          if (zoomBtn) zoomBtn.click();
        `);
        await sleep(600);
        await screenshot(path.join(artifactDir, 'screenshot_nucleus_zoom_stage1.png'));

        // 4. Stufe 2: Klicke auf Zoom-Next oder "Tiefer in die Atomhülle"
        await evaluate(`(() => {
          const b = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.innerText.includes('Atomhülle zoomen') || 
            btn.title === 'Reinzoomen' ||
            btn.innerText.includes('Hülle')
          );
          if (b) b.click();
        })()`);
        await sleep(600);
        await screenshot(shotStage2);

        // 5. Stufe 3: Klicke auf "Tiefer in den Atomkern zoomen"
        const clickRes3 = await evaluate(`(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const b = btns.find(btn => btn.innerText.includes('Atomkern zoomen'));
          if (b) {
            b.click();
            return 'Clicked: ' + b.innerText;
          }
          return 'Not found among ' + btns.map(btn => btn.innerText).join(' | ');
        })()`);
        console.log('Result for stage 3 click:', clickRes3);
        await sleep(600);
        await screenshot(shotStage3);

        // 6. Stufe 4: Klicke auf "Quarks"
        const clickRes4 = await evaluate(`(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const b = btns.find(btn => btn.innerText.includes('Quarks') || btn.innerText.includes('Gluonen'));
          if (b) {
            b.click();
            return 'Clicked: ' + b.innerText;
          }
          return 'Not found';
        })()`);
        console.log('Result for stage 4 click:', clickRes4);
        await sleep(600);
        await screenshot(shotStage4);

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
