#! /usr/bin/env node

const chalk = require('chalk')
const utils = require('./utils.js')
const usage = chalk.keyword('violet')('\nUsage: fbt-sync')
const yargs = require('yargs')

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
    .command({
        command: '*',
        async handler(argv) {
            if (argv._[0]) {
                if (!utils.getTokenFromEnv()) {
                    await utils.promptAndSaveToken()
                }
            }
        },
    })
    .showHelpOnFail()
    .help(true).argv

if (yargs.argv.init === true) {
    utils.initCommand()
} else if (yargs.argv.deploy === true) {
    const path = yargs.argv.path || ''
    utils.deployCommand(path, yargs.argv.pretty)
} else if (yargs.argv['upload-phrases'] === true) {
    utils.uploadPhrasesCommand()
} else if (yargs.argv['upload-translations'] === true) {
    utils.uploadTranslationsCommand()
} else if (yargs.argv._[0] == null) {
    yargs.showHelp()
}
