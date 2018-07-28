const http = require('http');
const path = require('path');
const fs = require('fs');
const config = require('./config/defaultConfig');

http
  .createServer((req, res) => {
    // 拿到当前请求的路径
    const filePath = path.join(config.root, req.url);
    // 判断是文件夹还是文件
    fs.stat(filePath, (err, stat) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`${filePath} is neither  directory nor file`);
        return;
      }
      if (stat.isFile()) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        fs.createReadStream(filePath).pipe(res);
      } else if (stat.isDirectory()) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        fs.readdir(filePath, (err, files) => {
          if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('读取错误');
            return;
          }
          res.end(files.join(','));
        });
      }
    });
  })
  .listen(config.port, config.hostname, () => {
    const addr = `http://${config.hostname}:${config.port}`;
    console.log(`Server started at ${addr}.....`);
  });
