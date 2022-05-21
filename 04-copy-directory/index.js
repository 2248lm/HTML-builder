const path = require('path');
const fs = require('fs');
const filesFolder = path.join(__dirname, 'files');
const filesCopyFolder = path.join(__dirname, 'files-copy');
async function copyDir(originalFolder, copyFolder) {
  fs.mkdir(copyFolder, { recursive: true }, err => {
    if (err) { throw err; }
  });
  fs.readdir(originalFolder, { withFileTypes: true }, (err, files) => {
    if (err) { throw err; }
    else {
      files.forEach(file => {
        const fileName = file.name;
        if (file.isFile()) {
          let fileWay;
          let copyFileWay;
          fileWay = path.join(originalFolder, fileName);
          copyFileWay = path.join(copyFolder, fileName);
          fs.stat(fileWay, (err, stats) => {
            if (err) { throw err; }
            else {
              fs.copyFile(fileWay, copyFileWay, err => {
                if (err) { throw err; }
              });
            }
          });
        } else {
          const subFolder = path.join(originalFolder, file.name);
          const copySubFolder = path.join(copyFolder, file.name);
          copyDir(subFolder, copySubFolder);
        }
      });
    }
  });
}
fs.rm(filesCopyFolder, { recursive: true, force: true }, () => copyDir(filesFolder, filesCopyFolder));
