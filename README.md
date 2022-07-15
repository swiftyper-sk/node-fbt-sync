<h1 align="center">
  <img src="icon.png" height="150" width="150" alt="FBT"/>
</h1>

# FBT sync

This library allows you to import native phrases (or your current translations) and deploy reviewed translations.

[Get started with Swiftyper Translations](https://translations.swiftyper.sk)

## 📦 Installing

```shell
# as a dev dependency (recommended)
$ npm install --save-dev fbt-sync

# as a global package
$ npm install --global fbt-sync
```

The installed binary is named `fbt-sync`. You can execute it directly in `node_modules/.bin/fbt-sync` or using [npx](https://www.npmjs.com/package/npx) (with or without installation) like `npx fbt-sync`.

## 🔧 Configuration

These steps are required:

1. Register your FBT project on [Swiftyper Translations](https://translations.swiftyper.sk)

2. Init project settings:
    ```shell
    $ ./node_modules/.bin/fbt-sync --init
    # or
    $ npx fbt-sync --init
    ```

### Options

The CLI will not prompt for an API key if a value is provided in the environment variable `SWIFTYPER_API_KEY`.

| Option                | Description                                  |
|-----------------------|----------------------------------------------|
| --deploy              | Deploy reviewed app translations             |
| --upload-translations | Upload translations to swiftyper             |
| --upload-phrases      | Upload native phrases to swiftyper           |
| --init                | Connect fbt project with swiftyper           |
| --pretty              | Pretty print output for translations file    |
| --path                | Path where to store translations e.g. ./src/ |

## 📜 License

The MIT License (MIT). Please see [LICENSE](LICENSE) for more information.
