const path = require('path');
const fs = require('fs');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesFolder = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(bundleFile));
fs.readdir(stylesFolder, { withFileTypes: true }, (err, files) => {
  if (err) { throw err; }
  else {
    files.forEach(file => {
      if (file.isFile()) {
        const fileName = file.name;
        const fileWay = path.join(stylesFolder, fileName);
        fs.stat(fileWay, (err, stats) => {
          const fileDirectory = path.resolve(fileName);
          const fileObject = path.parse(fileDirectory);
          if (err) { throw err; }
          else {
            if (fileObject.ext === '.css') {
              const readStream = fs.createReadStream(fileWay, 'utf-8');
              readStream.on('data', chunk => writeStream.write(chunk + "\n\n"));
              readStream.on('error', error => console.log('Error', error.message));
            }
          }
        });
      }
    });
  }
});
