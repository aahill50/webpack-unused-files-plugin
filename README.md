# webpack-unused-files-plugin

Find and remove unused code from your project.

## Features

This webpack plugin generates 2 JSON files that contain 1) All file dependencies from your project and 2) a list of all files found tht match a glob pattern you provide. Using these 2 files, you can generate a list of files that are unused (not included in a webpack bundle). These files can likely be deleted without affecting the performance of your application.

Please note that this process relies on webpack's generation of file dependencies, and a glob pattern indicating _where_ files live in your application that you're expecting to be bundled. If there are files that you rely on outside of the webpack process, you should make sure to include those paths in the `ignore` array that can be passed as an option (static files, server-side files etc).

## Installation:

```sh
# Using yarn
yarn add webpack-unused-files-plugin --dev

# Using npm
npm install webpack-unused-files-plugin --save-dev
```

## Plugin Usage:

To generate the list of unused files, require this package in your webpack config and add an instance of it to the plugins array.

This plugin takes 2 options, see the comments in the example below:
(See [npm-glob](https://www.npmjs.com/package/glob) for details about glob options)

```js
const WebpackUnusedFilesPlugin = require('webpack-unused-files-plugin');

module.exports = {
    // webpack config...,

    plugins: [
        // your plugins...,

        new WebpackUnusedFilesPlugin({
            // A glob pattern to find all possible files you want to check
            // Must be a string
            // Defaults to '**/*.*' which will include ALL files (except those specifically ignored)
            pattern: '**/*.*',

            // A string or an array of strings of glob patterns
            // Each file found in this list will not be checked to see if it is used
            // Must be an array of strings
            // Defaults to ['node_modules/**']
            ignore: ['node_modules/**'],
        }),
    ],
};
```

## Script Usage

Once the plugin has been added to your webpack config and the webpack process has been run, the 2 lists of files mentioned above should have been generated (webpack-unused-files-plugin-dependencies.json & webpack-unused-files-plugin-globbed-files.json). Now you can run the rmUnusedFiles script, which will calculate the unused files and prompt you for each file to be deleted. At any point you can choose to delete the rest of the files or skip all remaining files

```sh
# Using yarn
yarn rmUnusedFiles

# Using npm
npm run rmUnusedFiles
```

## Notes on Usage

It's important to note that this plugin identifies files that are unused _according to your webpack process_. This means that any files used strictly server side or otherwise not bundled by webpack will be identified as unused if they match the glob search pattern.

Also note that the rmUnusedFiles script will not remove any tests associated with deleted files, so you will have to manually clean up any specs for files that have been deleted (or use a utility such as [Orphan Finder](https://github.com/aahill50/orphan-finder))
