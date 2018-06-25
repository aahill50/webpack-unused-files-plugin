'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');
const { defaults } = require('./defaults');
const { FILE_NAMES, FILE_PREFIX } = require('./constants');
const { filePath, reduceFilesIntoObj, writeArrayToFile } = require('./helpers');

class WebpackUnusedFilesPlugin {
    constructor(options = {}) {
        const { pattern = defaults.pattern, ignore = defaults.ignore } = options;
        this.options = { pattern, ignore };

        rimraf(filePath(FILE_NAMES.deps), err => (err ? console.log(err) : null));
        rimraf(filePath(FILE_NAMES.globbed), err => (err ? console.log(err) : null));
    }
    apply(compiler) {
        const { pattern, ignore } = this.options;
        const filesToIgnore = ignore
            .reduce((files, ignorePattern) => {
                return [...files, ...glob.sync(ignorePattern)];
            }, [])
            .reduce(reduceFilesIntoObj, {});
        const allFiles = glob
            .sync(pattern, { ignore })
            .filter(file => !filesToIgnore[file])
            .reduce(reduceFilesIntoObj, {});

        compiler.plugin('after-emit', (compilation, done) => {
            let fileDeps = [];
            try {
                fileDeps = JSON.parse(fs.readFileSync(filePath(fileDepsFileName), 'utf8'));
            } catch (e) {}
            writeArrayToFile(FILE_NAMES.globbed, Object.keys(allFiles));
            writeArrayToFile(FILE_NAMES.deps, [...fileDeps, ...compilation.fileDependencies]);
            done();
        });
    }
}

module.exports = WebpackUnusedFilesPlugin;
