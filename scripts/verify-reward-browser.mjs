import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Chemistry-Mystery.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const outScreenshot = path.join(artifactDir, 'screenshot_rewards.png');

console.log('Starte Headless Chrome mit CDP...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--window-size=1280,900',
  '--disable-gpu',
  '--no-sandbox',
  fileUrl
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('Kein Tab gefunden');

    const wsUrl = pageTab.webSocketDebuggerUrl;
    const WebSocket = (await import('ws')).default || (await import('ws'));
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      // Klicke auf Belohnungen-Button, um das Modal zu öffnen
      const clickScript = `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Belohnungen'));
        if (btn) btn.click();
      `;

      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: clickScript } }));

      setTimeout(() => {
        ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1000);
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
    console.error('Fehler bei CDP:', err);
    chrome.kill();
    process.exit(1);
  }
}, 2000);
