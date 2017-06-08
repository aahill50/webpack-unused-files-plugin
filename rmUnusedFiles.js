#! /usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const inquirer = require('inquirer');

const getFilePath = {
    type: 'input',
    name: 'filePath',
    message: 'Please enter the file containing the list of files to remove',
    default: 'webpack-unused-files.json'
};

const promptForFilePath = () => {
    return inquirer.prompt(getFilePath)
        .then(answers => {
            const filePath = path.resolve(process.cwd(), answers.filePath);
            if (!fs.existsSync(filePath)) {
                throw new Error(`Cannot find ${answers.filePath}`);
            }
            return filePath;
        })
};

const isValidAnswer = value => {
    const isUndefined = typeof value === 'undefined';
    const isEmpty = !value.length;
    const isValidAnswer = ['y', 'yes', 'n', 'no', 'r', 'rest', 's', 'skip'].includes(value.toLowerCase());

    return !isUndefined && !isEmpty && isValidAnswer;
};

const getShortAnswer = val => {
    return isValidAnswer(val) ? val[0].toLowerCase() : null;
};

const outputDeleteResult = (...messages) => {
    messages.forEach(msg => console.log(`  ${msg}`));
    console.log();
};
promptForFilePath()
    .then(filePath => {
        const files = require(filePath);
        const questions = files.map(file => {
            return {
                type: 'input',
                name: `deleteFile`,
                message: `Delete ${file} ? yes/no/rest/skip`,
                filter: val => val.toLowerCase(),
                validate: value => isValidAnswer(value) ? true : 'Please enter a valid value'
            };
        });

        const areYouSureDelete = {
            type: 'confirm',
            name: 'confirmDelete',
            message: 'Are you sure you want to delete all remaining files?'
        };
        const areYouSureSkip = {
            type: 'confirm',
            name: 'confirmSkip',
            message: 'Are you sure you want to skip all remaining files?'
        };
        let filesToDelete = [];
        let questionIdxToAsk = 0;

        const promptForDeleteFile = idx => {
            return inquirer.prompt(questions[idx])
                .then(answers => {
                    const shortAnswer = getShortAnswer(answers.deleteFile);
                    if (shortAnswer === 'r') {
                        return promptForDeleteRestConfirmation(idx);
                    } else if (shortAnswer === 's') {
                        return promptForSkipRestConfirmation(idx);
                    } else {
                        if (shortAnswer === 'y') {
                            filesToDelete.push(files[idx]);
                        }
                        questionIdxToAsk++;
                        if (questions[questionIdxToAsk]) {
                            return promptForDeleteFile(questionIdxToAsk);
                        } else {
                            return true;
                        }
                    }
                });
        };

        const promptForDeleteRestConfirmation = lastIdx => {
            return inquirer.prompt(areYouSureDelete)
                .then(answers => {
                    if (answers.confirmDelete) {
                        filesToDelete = filesToDelete.concat(files.slice(lastIdx));
                    } else {
                        return promptForDeleteFile(lastIdx);
                    }
                })
        };

        const promptForSkipRestConfirmation = lastIdx => {
            return inquirer.prompt(areYouSureSkip)
                .then(answers => {
                    if (!answers.confirmSkip) {
                        return promptForDeleteFile(lastIdx);
                    }
                })
        };

        console.log('');
        console.log('Valid answers:');
        console.log('  [y]es  - Delete this file');
        console.log('  [n]o   - Do not delete this file');
        console.log('  [r]est - Delete this file and all remaining files');
        console.log('  [s]kip - Do not delete this file or any remaining files');
        console.log('Answers are not case-sensitive');
        promptForDeleteFile(0).then(() => {
            if (!filesToDelete.length) {
                console.log('No files deleted');
            }
            filesToDelete.forEach(file => {
                console.log(`Deleting: ${file}`);
                if (!fs.existsSync(file)) {
                    outputDeleteResult(`Cannot find file: ${file}`);
                } else {
                    try {
                        fs.unlinkSync(file);
                        outputDeleteResult(`Successfully deleted: ${file}`);
                    } catch(e) {
                        outputDeleteResult(`Error deleting: ${file}${os.EOL}    ${e}`, 'File was not deleted');
                    }
                }
            });
        });
    })
    .catch(console.log);
