import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Chemistry-Mystery.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const outScreenshot = path.join(artifactDir, 'screenshot_sandbox.png');

console.log('Starte Headless Chrome mit CDP für Freies Experimentierlabor & System-Upgrade...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--window-size=1440,960',
  '--disable-gpu',
  '--no-sandbox',
  fileUrl
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9226/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('Kein Tab gefunden');

    const wsUrl = pageTab.webSocketDebuggerUrl;
    const WebSocket = (await import('ws')).default || (await import('ws'));
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      // Navigiere zu Sandbox
      const clickScript = `
        const sandboxBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sandbox') || b.innerText.includes('Experimentierlabor'));
        if (sandboxBtn) sandboxBtn.click();
        
        setTimeout(() => {
          // Klicke 2x auf Wasserstoff (H) und 1x auf Sauerstoff (O)
          const buttons = Array.from(document.querySelectorAll('button'));
          const hBtn = buttons.find(b => b.innerText.includes('H') && b.innerText.includes('Wasserstoff'));
          const oBtn = buttons.find(b => b.innerText.includes('O') && b.innerText.includes('Sauerstoff'));
          if (hBtn) {
            hBtn.click();
            hBtn.click();
          }
          if (oBtn) {
            oBtn.click();
          }
        }, 500);
      `;

      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: clickScript } }));

      setTimeout(() => {
        ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1500);
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

  } catch (err) {
    console.error('Fehler bei Chrome CDP Test:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1200);
