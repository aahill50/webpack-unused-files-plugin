const FILE_PREFIX = 'wp-unused-files-plugin';
const FILE_NAMES = {
    deps: `${FILE_PREFIX}-dependencies`,
    globbed: `${FILE_PREFIX}-globbed-files`,
    unused: `${FILE_PREFIX}-unused-files`,
};

module.exports = {
    FILE_NAMES,
    FILE_PREFIX,
};
