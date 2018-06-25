const fs = require('fs');
const path = require('path');
const { FILE_PREFIX, FILE_NAMES } = require('./constants');
const { filePath, reduceFilesIntoObj } = require('./helpers');

const getUnusedFiles = () => {
    const globbed = JSON.parse(fs.readFileSync(filePath(FILE_NAMES.globbed), 'utf8'));
    const deps = JSON.parse(fs.readFileSync(filePath(FILE_NAMES.deps), 'utf8'));

    const depsObj = deps.reduce(reduceFilesIntoObj, {});

    const unusedFiles = [];

    globbed.forEach(file => {
        if (!depsObj[file]) {
            unusedFiles.push(file);
        }
    });

    return unusedFiles;
};

module.exports = {
    getUnusedFiles,
};
