import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve('Chemistry-Mystery.html');
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const artifactDir = 'C:\\Users\\Abdal\\.gemini\\antigravity\\brain\\7e0d593a-dde0-4045-a09f-070f2d7670ba';
const outScreenshot = path.join(artifactDir, 'screenshot_pse_motion.png');

console.log('Starte Headless Chrome mit CDP für Periodensystem & Quantensprung-Bewegung...');
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--window-size=1440,960',
  '--disable-gpu',
  '--no-sandbox',
  fileUrl
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9225/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('Kein Tab gefunden');

    const wsUrl = pageTab.webSocketDebuggerUrl;
    const WebSocket = (await import('ws')).default || (await import('ws'));
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      // 1. Klicke auf Periodensystem Button
      const clickScript = `
        const pseBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Periodensystem') || b.innerText.includes('PSE'));
        if (pseBtn) pseBtn.click();
        
        // Nach kurzer Pause Element Eisen (Fe, 26) oder Gold (Au, 79) auswählen
        setTimeout(() => {
          const goldCell = Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('Au') && d.innerText.includes('79'));
          if (goldCell) goldCell.click();
          
          // Quantensprung anstoßen
          setTimeout(() => {
            const quantumBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quantensprung'));
            if (quantumBtn) quantumBtn.click();
          }, 300);
        }, 500);
      `;

      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: clickScript } }));

      setTimeout(() => {
        ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      }, 1800);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 2 && msg.result && msg.result.data) {
        fs.writeFileSync(outScreenshot, Buffer.from(msg.result.data, 'base64'));
        console.log('Screenshot des Periodensystems & Bohr-Atoms erfolgreich gespeichert:', outScreenshot);
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
