const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');
const { FILE_PREFIX } = require('./constants');

const reduceFilesIntoObj = (obj, file) => {
    obj[file] = true;
    return obj;
};

const filePath = fileName => path.resolve(process.cwd(), fileName);

const writeArrayToFile = (fileName, arr) => {
    fs.writeFileSync(filePath(fileName), JSON.stringify(arr, null, 2));
};

const rmUnusedPluginFiles = () => {
    glob.sync(`${FILE_PREFIX}*`).forEach(file => {
        rimraf(filePath(file), err => (err ? console.error(err) : null));
    });
};

const withExt = fileName => `${fileName}.json`;

module.exports = {
    filePath,
    reduceFilesIntoObj,
    rmUnusedPluginFiles,
    withExt,
    writeArrayToFile,
};
