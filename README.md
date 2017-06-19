# webpack-unused-files-plugin
Find and remove unused code from your project.

## Features
This webpack plugin generates a JSON file that contains all of the files that are not used by webpack when it bundles your code.
Any files identified can likely be deleted without affecting the performance of your application. 
Please note that this process relies on webpack's generation of file dependencies. If there are files that you rely on outside of the webpack process, you should ignore them when running this plugin.

In addition, a separate JSON file will be generated that contains the list of files that are being used by webpack, but were not checked for usage because they were not found by the glob pattern you provided

## Installation:
```sh
# Using yarn
yarn add webpack-unused-files-plugin --dev

# Using npm
npm install webpack-unused-files-plugin --save-dev
```

## Plugin Usage:
To generate the list of unused files, require this package in your webpack config and add an instance of it to the plugins array. 

This plugin takes 4 options, see the comments in the example below:
(See [npm-glob](https://www.npmjs.com/package/glob) for details about glob options)
```js
const WebpackUnusedFilesPlugin = require('webpack-unused-files-plugin');

module.exports = {
    // webpack config...,
    
    plugins: [
        // your plugins...,
        
        new WebpackUnusedFilesPlugin({
            // A glob pattern to find all possible files you want to check
            // Defaults to '**/*.*' which will include ALL files (except those specifically ignored) 
            pattern: '**/*.*',
            
            // A string or an array of strings of glob patterns
            // Each file found in this list will not be checked to see if it is used
            // Defaults to ['node_modules/**']
            ignore: ['node_modules/**'],
            
            // The name of the file that will contain the list of unused files
            // Defaults to 'webpack-unused-files.json'
            unusedFileName: 'webpack-unused-files.json',
            
            // This file will contain a list of files that are dependencies of webpack, but were not a part of the search pattern you provided
            // Files that have been ignored will not show up here
            // Defaults to 'webpack-unchecked-files.json'
            uncheckedFileName: 'webpack-unchecked-files.json'
        })
    ]
};
```

## Script Usage
In addition, this plugin contains a script that can be used to remove the unused files that were found

Once the plugin has been added to your webpack config and the webpack process has been run, the list of unused files should have been generated (webpack-unused-files.json by default). Now you can run the rmUnusedFiles script, which will prompt you for each file to be deleted. At any point you can choose to delete all remaining files or skip all remaining files

```sh
# Using yarn
yarn rmUnusedFiles

# Using npm
npm run rmUnusedFiles
```

## Notes on Usage
It's important to note that this plugin identifies files that are unused *according to your webpack process*. This means that any files used strictly server side or otherwise not bundled by webpack will be identified as unused if they match the glob search pattern.

Also note that the rmUnusedFiles script will not remove any tests associated with deleted files, so you will have to manually clean up any specs for files that have been deleted.
