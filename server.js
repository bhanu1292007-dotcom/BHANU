const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.normalize(path.join(BASE_DIR, reqPath));

  // Security check: ensure path is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #070b14; color: white;">
          <h1 style="color: #10b981;">404 - Not Found</h1>
          <p>The requested file <code>${reqPath}</code> was not found.</p>
          <a href="/" style="color: #06b6d4;">Back to Home</a>
        </div>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Bhanu Yadav's Portfolio Server is running!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📄 Open your browser to explore the portfolio.`);
  console.log(`======================================================\n`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.log(`⚠️ Port ${PORT} is in use, trying ${nextPort}...`);
    server.listen(nextPort);
  } else {
    console.error('Server error:', e);
  }
});
