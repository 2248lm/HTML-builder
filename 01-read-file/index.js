const path = require('path');
const fs = require('fs');
const fileDirectory = path.join(__dirname, 'text.txt');
const fileInnerText = fs.createReadStream(fileDirectory, 'utf-8');
let data = '';
fileInnerText.on('data', chunk => data += chunk);
fileInnerText.on('end', () => console.log(data));
