const homedir = require('os').homedir()
const chalk = require('chalk')
const { prompt } = require('enquirer')
const Swiftyper = require('swiftyper-node')
const fs = require('fs')
const path = require('path')
const resolve = path.resolve

const CONFIG_FILE = path.join(homedir, '.config', 'swiftyper')
const ACCOUNT_URL = 'https://manage.swiftyper.sk'
const client = new Swiftyper(getToken())

function getTokenFromEnv() {
    return process.env.SWIFTYPER_API_KEY
}

async function read(stream) {
    const chunks = []

    for await (const chunk of stream) {
        chunks.push(chunk)
    }

    return Buffer.concat(chunks).toString('utf8')
}

function getToken() {
    const token = getTokenFromEnv()

    if (token) {
        return token
    }

    const file = CONFIG_FILE

    if (!fs.existsSync(file)) {
        return null
    }

    return fs.readFileSync(file, 'utf8')
}

async function promptToken() {
    const tokenDescription =
        `To get started, you'll need your swiftyper API key.` +
        ` You can find your project key at: ${ACCOUNT_URL} in "Project Settings" page.`

    console.log('\n')

    console.log(tokenDescription)

    console.log('\n')

    const response = await prompt({
        type: 'input',
        name: 'token',
        message: 'What is your API key?',
    })

    return response.token
}

async function promptAndSaveToken() {
    try {
        const token = await promptToken()
        console.log(
            `Thanks for authenticating. We'll save the key to: ${CONFIG_FILE}`
        )

        await saveToken(token)

        return token
    } catch ({ message }) {
        console.error(chalk.red.bold(message))
    }
}

async function saveToken(token) {
    client._setApiKey(token)
    fs.writeFileSync(CONFIG_FILE, token, 'utf8')
}

async function uploadPhrasesCommand() {
    console.log('⚡  Uploading phrases...')

    try {
        if (process.stdin.isTTY) {
            console.error(chalk.red.bold('Invalid stdin input.'))
            return
        }

        const native_strings = await read(process.stdin)

        const { saved } = await client.phrases.upload({
            native_strings,
        })

        console.log(chalk.red.green(saved + ' phrases has been stored.'))
    } catch ({ message }) {
        console.error(chalk.red.bold(message))
    }
}

async function uploadTranslationsCommand() {
    console.log('⚡  Uploading translations...')

    try {
        if (process.stdin.isTTY) {
            console.error(chalk.red.bold('Invalid stdin input.'))
            return
        }

        const locale_translations = await read(process.stdin)

        const { translations } = await client.translations.upload({
            locale_translations,
        })

        console.log(
            chalk.red.green(translations + ' translations has been stored.')
        )
    } catch ({ message }) {
        console.error(chalk.red.bold(message))
    }
}

async function deployCommand(store_path, pretty) {
    console.log('👽  Translating app...')

    try {
        let json
        const translations = await client.translations.raw()

        if (pretty) {
            json = JSON.stringify(translations, null, 2)
        } else {
            json = JSON.stringify(translations)
        }

        const { dir, base, ext } = path.parse(store_path)

        let basename = 'translatedFbts.json'
        if (ext === '.json') {
            basename = base
            store_path = dir
        }

        const file = resolve(__dirname + '/../../../' + store_path, basename)

        fs.writeFileSync(file, json, 'utf8')

        console.log(chalk.red.green('Translations has been deployed.'))
        console.log(`Path: ` + file)
    } catch ({ message }) {
        console.error(chalk.red.bold(message))
    }
}

async function initCommand() {
    console.log('🚀  Initializing project...')

    try {
        await client.fbt.init({
            platform: 'javascript',
            version: '1.0.0',
            hash_module: 'md5',
            md5_digest: 'base64',
        })

        console.log(chalk.red.green('Project is prepared.'))
    } catch ({ message }) {
        console.error(chalk.red.bold(message))
    }
}

module.exports = {
    uploadPhrasesCommand,
    uploadTranslationsCommand,
    promptAndSaveToken,
    getTokenFromEnv,
    deployCommand,
    initCommand,
}
