const FILE_PREFIX = 'wp-unused-files-plugin';
const FILE_NAMES = {
    deps: `${FILE_PREFIX}-dependencies.json`,
    globbed: `${FILE_PREFIX}-globbed-files.json`,
    unused: `${FILE_PREFIX}-unused-files.json`,
};

module.exports = {
    FILE_NAMES,
    FILE_PREFIX,
};
