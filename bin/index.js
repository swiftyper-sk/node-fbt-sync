#! /usr/bin/env node

const chalk = require('chalk')
const utils = require('./utils.js')
const usage = chalk.keyword('violet')('\nUsage: fbt-sync')
const yargs = require('yargs')
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

const options = yargs
    .usage(usage)
    .option('init', {
        describe: 'Connect fbt project with swiftyper.',
        type: 'boolean',
        demandOption: false,
    })
    .option('pretty', {
        describe: 'Pretty print output.',
        type: 'boolean',
        demandOption: false,
    })
    .option('path', {
        describe: 'Path where to store translations e.g. ./src/',
        type: 'string',
        demandOption: false,
    })
    .option('deploy', {
        describe: 'Deploy reviewed app translations.',
        type: 'boolean',
        demandOption: false,
    })
    .option('upload-translations < stdin', {
        describe: 'Upload translations to swiftyper.',
        demandOption: false,
    })
    .option('upload-phrases < stdin', {
        describe: 'Upload native phrases to swiftyper.',
        demandOption: false,
    })
    .showHelpOnFail()
    .help(true).argv

if (options.init === true) {
    utils.initCommand()
} else if (options.deploy === true) {
    const path = options.path || ''
    utils.deployCommand(path, options.pretty)
} else if (options['upload-phrases'] === true) {
    utils.uploadPhrasesCommand()
} else if (options['upload-translations'] === true) {
    utils.uploadTranslationsCommand()
} else {
    yargs.showHelp()
}
