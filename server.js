// ============================================================================
// Smart Fire Alarm System — Cross-Platform React Native & Expo Web/Mobile Server
// Runs on http://localhost:3000 (and LAN IP for Mobile/Tablet testing)
// Connects to Node.js + SQL Backend on http://localhost:4000/api
// ============================================================================

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { exec } = require('node:child_process');
const { URL } = require('node:url');

const PORT = process.env.PORT || 3000;
const FRONTEND_ROOT = __dirname;

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.css': 'text/css; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '/index.html') {
    const htmlPath = path.join(FRONTEND_ROOT, 'web', 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(htmlPath, 'utf8'));
  }

  const rel = pathname.replace(/^\/frontend\//, '').replace(/^\//, '');
  const safePath = path.normalize(path.join(FRONTEND_ROOT, rel));

  if (safePath.startsWith(FRONTEND_ROOT) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_MAP[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    return res.end(fs.readFileSync(safePath));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'File not found' }));
});

server.listen(PORT, () => {
  const lanIp = getLanIp();
  console.log('');
  console.log('======================================================================');
  console.log('🔥 SMART FIRE ALARM SYSTEM — EXPO / REACT NATIVE DEV SERVER');
  console.log('======================================================================');
  console.log(`  ➜  Local (Web Admin Console W-01..W-21):  http://localhost:${PORT}`);
  console.log(`  ➜  LAN (Mobile / Tablet on same Wi-Fi):   http://${lanIp}:${PORT}`);
  console.log(`  ➜  SQL Backend API & SSE Stream:          http://localhost:4000/api`);
  console.log('----------------------------------------------------------------------');
  console.log('  › Press w │ open Web Admin Console in browser (http://localhost:3000)');
  console.log('  › Press m │ open Mobile/Tablet Homeowner View in browser');
  console.log('  › Press r │ reload app');
  console.log('  › Press q │ quit server');
  console.log('======================================================================');

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key) => {
      if (key === '\u0003' || key === 'q') {
        process.exit(0);
      } else if (key === 'w') {
        console.log('Opening http://localhost:' + PORT + ' in browser...');
        exec(`start http://localhost:${PORT}`);
      } else if (key === 'm' || key === 'a' || key === 'i') {
        console.log('Opening Mobile/Tablet Preview at http://localhost:' + PORT + ' ...');
        exec(`start http://localhost:${PORT}`);
      } else if (key === 'r') {
        console.log('Reloading React Native bundle...');
      }
    });
  }
});
