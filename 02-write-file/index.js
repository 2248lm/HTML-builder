const path = require('path');
const fs = require('fs');
const { stdin } = process;
const fileDirectory = path.join(__dirname, 'note.txt');
const writeStream = fs.createWriteStream(path.join(fileDirectory));
console.log('\n1. Пожалуйста, введите своё сообщение и нажмите Enter.');
console.log('2. Если Вы хотите выйти из потока записи, нажмите сочетание клавиш Ctrl + C или введите exit и нажмите Enter.\n');
stdin.on('data', data => {
  const message = data.toString().trim();
  if (message === 'exit') {
    writeStream.end();
    process.exit();
  }
  else {
    writeStream.write(data);
  }
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', code => {
  if (code === 0) {
    console.log('\nУдачи в изучении Node.js!\n');
  } else {
    console.log(`Ошибка: ${code}`);
  }
});
