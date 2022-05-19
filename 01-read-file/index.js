const path = require('path');
const fs = require('fs');
const fileDirectory = path.join(__dirname, 'text.txt');
const fileInnerText = fs.createReadStream(fileDirectory, 'utf-8');
fileInnerText.on('data', data => console.log(data));
