const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const publicFolder = path.join(__dirname, 'game');

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);

  // Determine the file path based on the URL
  const filePath = path.join(publicFolder, req.url);

  // Check if the requested file exists
  fs.access(filePath, (err) => {
    if (err) {
      console.error(err);
      res.writeHead(404);
      res.end('File not found');
    } else {
      // Read the file and serve it with the appropriate content type
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500);
          res.end('Server error');
        } else {
          let contentType = 'text/plain';
          const ext = path.extname(filePath);
          if (ext === '.html') {
            contentType = 'text/html';
          } else if (ext === '.css') {
            contentType = 'text/css';
          } else if (ext === '.js') {
            contentType = 'text/javascript';
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});