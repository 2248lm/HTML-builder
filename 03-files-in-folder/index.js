const path = require('path');
const fs = require('fs');
const secretFolder = path.join(__dirname, 'secret-folder');
fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        const fileName = file.name;
        const fileWay = path.join(secretFolder, fileName);
        fs.stat(fileWay, (err, stats) => {
          const fileDirectory = path.resolve(fileName);
          const fileObject = path.parse(fileDirectory);
          if (err) {
            throw err;
          } else {
            console.log(`${fileObject.name} - ${fileObject.ext.slice(1)} - ${stats.size} b`);
          }
        });
      }
    });
  }
});
