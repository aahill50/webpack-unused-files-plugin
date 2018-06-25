'use strict';

const glob = require('glob');
const { defaults } = require('./defaults');
const { FILE_NAMES } = require('./constants');
const { filePath, rmUnusedPluginFiles, withExt, writeArrayToFile } = require('./helpers');

class WebpackUnusedFilesPlugin {
    constructor(options = {}) {
        const { pattern = defaults.pattern, ignore = defaults.ignore } = options;
        this.options = { pattern, ignore };
        rmUnusedPluginFiles();
    }
    apply(compiler) {
        const { pattern, ignore } = this.options;
        const compilerName = compiler.options.name;
        const allFiles = glob.sync(pattern, { ignore }).map(filePath);

        const util = require('util');
        compiler.plugin('after-emit', (compilation, done) => {
            writeArrayToFile(withExt(FILE_NAMES.globbed), allFiles);
            writeArrayToFile(withExt(`${FILE_NAMES.deps}-${compilerName}`), [
                ...compilation.fileDependencies,
            ]);
            done();
        });
    }
}

module.exports = WebpackUnusedFilesPlugin;
