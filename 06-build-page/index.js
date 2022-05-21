const path = require('path');
const fs = require('fs');

const projectDist = path.join(__dirname, 'project-dist');
const indexHtml = path.join(projectDist, 'index.html');
const styleCSS = path.join(projectDist, 'style.css');
const assets = path.join(projectDist, 'assets');

const template = path.join(__dirname, 'template.html');
const stylesSource = path.join(__dirname, 'styles');
const assetsSource = path.join(__dirname, 'assets');
const componentsFolder = path.join(__dirname, 'components');

fs.mkdir(projectDist, { recursive: true }, err => {
  if (err) { throw err; }
});

const readTemplate = fs.createReadStream(template, 'utf-8');
let templateInner = '';
readTemplate.on('data', chunk => {
  templateInner += chunk;
});
readTemplate.on('end', () => {
  findTag(templateInner);
});
readTemplate.on('error', error => console.log('Error: ', error.message));
const findTag = (text) => {
  fs.readdir(componentsFolder, { withFileTypes: true }, (err, files) => {
    if (err) { throw err; }
    const tags = text.match(/{{(.*?)}}/g);
    tags.forEach(tagItem => {
      const tag = tagItem.split('').filter(e => !/[\{\}]/g.test(e)).join('').trim();
      files.forEach(file => {
        if (file.isFile()) {
          const fileWay = path.join(componentsFolder, file.name);
          fs.stat(fileWay, (err, stats) => {
            const fileObject = path.parse(path.resolve(file.name));
            if (err) { throw err; }
            else {
              if (fileObject.ext === '.html' && fileObject.name === tag) {
                let componentInner = '';
                const readFile = fs.createReadStream(fileWay, 'utf-8');
                readFile.on('data', chunk => {
                  componentInner += chunk;
                });
                readFile.on('end', () => {
                  text = text.replace(tagItem, "\n" + componentInner + "\n");
                  const writeIndexHtml = fs.createWriteStream(indexHtml);
                  writeIndexHtml.write(text);
                });
                readFile.on('error', error => console.log('Error: ', error.message));
              }
            }
          });
        }
      });
    });
  });
}

const writeStyles = fs.createWriteStream(path.join(styleCSS));
fs.readdir(stylesSource, { withFileTypes: true }, (err, files) => {
  if (err) { throw err; }
  else {
    files.forEach(file => {
      if (file.isFile()) {
        const fileWay = path.join(stylesSource, file.name);
        fs.stat(fileWay, (err, stats) => {
          const fileObject = path.parse(path.resolve(file.name));
          if (err) { throw err; }
          else {
            if (fileObject.ext === '.css') {
              const readStyles = fs.createReadStream(fileWay, 'utf-8');
              readStyles.on('data', chunk => writeStyles.write(chunk + "\n\n"));
              readStyles.on('error', error => console.log('Error: ', error.message));
            }
          }
        });
      }
    });
  }
});

const copyAssets = (originalFolder, copyFolder) => {
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
          copyAssets(subFolder, copySubFolder);
        }
      });
    }
  });
}
fs.rm(assets, { recursive: true, force: true }, () => copyAssets(assetsSource, assets));
