'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const defaults = {
    pattern: '**/*.*',
    ignore: ['node_modules/**'],
    unusedFileName: 'webpack-unused-files.json',
    uncheckedFileName: 'webpack-unchecked-files.json'
};

const reduceFilesIntoObj = (obj, file) => {
    obj[path.resolve(process.cwd(), file)] = true;
    return obj;
};

const  writeArrayToFile = (fileName, arr) => {
    fs.writeFileSync(path.resolve(process.cwd(), fileName), JSON.stringify(arr, null, 2));
};

class WebpackUnusedFilesPlugin {
    constructor(options = {}) {
        const {
            pattern = defaults.pattern,
            ignore =  defaults.ignore,
            unusedFileName = defaults.unusedFileName,
            uncheckedFileName =  defaults.uncheckedFileName
        } = options;
        this.options = { pattern, ignore, unusedFileName, uncheckedFileName };
    }
    apply(compiler) {
        const { pattern, ignore, unusedFileName, uncheckedFileName } = this.options;
        const allFiles = glob.sync(pattern,  { ignore }).reduce(reduceFilesIntoObj, {});
        const filesToIgnore = ignore.reduce((files, ignorePattern) => {
            return [ ...files, ...glob.sync(ignorePattern)];
        }, []).reduce(reduceFilesIntoObj, {});
        let unusedFiles = Object.assign({}, allFiles);
        let uncheckedFiles = {};

        compiler.plugin('after-emit', (compilation, done) => {
            compilation.fileDependencies.forEach(dep => {
                if (unusedFiles[dep]) {
                    delete unusedFiles[dep];
                } else {
                    if (!filesToIgnore[dep]) {
                        uncheckedFiles[dep] = true;
                    }
                }
            });

            writeArrayToFile(unusedFileName, Object.keys(unusedFiles));
            writeArrayToFile(uncheckedFileName, Object.keys(uncheckedFiles));
            done();
        });
    }
}

module.exports = WebpackUnusedFilesPlugin;
