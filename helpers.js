const fs = require('fs');
const path = require('path');

const reduceFilesIntoObj = (obj, file) => {
    obj[file] = true;
    return obj;
};

const filePath = fileName => path.resolve(process.cwd(), fileName);

const writeArrayToFile = (fileName, arr) => {
    fs.writeFileSync(filePath(fileName), JSON.stringify(arr, null, 2));
};

module.exports = {
    filePath,
    reduceFilesIntoObj,
    writeArrayToFile,
};
