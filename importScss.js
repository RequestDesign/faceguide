
const fs = require('fs');

const directoryPath = __dirname + '/src/scss/components';

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error( err);
    return;
  }

  files.forEach(file => {
    console.log("@import './"+ file + "';");
  });
});