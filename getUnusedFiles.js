const fs = require('fs');
const path = require('path');
const { FILE_PREFIX, FILE_NAMES } = require('./constants');
const { filePath, reduceFilesIntoObj, writeArrayToFile } = require('./helpers');

const getUnusedFiles = () => {
    const globbed = JSON.parse(fs.readFileSync(filePath(FILE_NAMES.globbed), 'utf8'));
    const deps = JSON.parse(fs.readFileSync(filePath(FILE_NAMES.deps), 'utf8'));

    const depsObj = deps.reduce(reduceFilesIntoObj, {});

    const unusedFiles = globbed.reduce((unused, file) => {
        const fileWithPath = filePath(file);
        if (!depsObj[file]) {
            unused.push(file);
        }
        return unused;
    }, []);

    writeArrayToFile(FILE_NAMES.unused, unusedFiles);

    return unusedFiles;
};

module.exports = {
    getUnusedFiles,
};
