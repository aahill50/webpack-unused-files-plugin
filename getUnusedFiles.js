const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { FILE_PREFIX, FILE_NAMES } = require('./constants');
const { filePath, reduceFilesIntoObj, withExt, writeArrayToFile } = require('./helpers');

const getUnusedFiles = () => {
    const globbed = JSON.parse(fs.readFileSync(filePath(withExt(FILE_NAMES.globbed)), 'utf8'));
    const depFiles = glob.sync(`${FILE_NAMES.deps}*`);
    const deps = depFiles.reduce((files, file) => {
        return [...files, ...JSON.parse(fs.readFileSync(file, 'utf8'))];
    }, []);

    const depsObj = deps.reduce(reduceFilesIntoObj, {});

    const unusedFiles = globbed.reduce((unused, file) => {
        const fileWithPath = filePath(file);
        if (!depsObj[file]) {
            unused.push(file);
        }
        return unused;
    }, []);

    writeArrayToFile(withExt(FILE_NAMES.unused), unusedFiles);

    return unusedFiles;
};

module.exports = {
    getUnusedFiles,
};
