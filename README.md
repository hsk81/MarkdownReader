# MarkdownReader dizmo

Create the `MarkdownReader` dizmo by running `npm run make` and drag and drop the generated file &ndash; which can be found at `build/MarkdownReader-x.y.z.dzm` &ndash; onto dizmoViewer. The suffix of the file will be the current version number.

## Building

Building the dizmo requires a sequence of tasks to be run, which are:

* `npm run clean`: Cleans the previous build (if any) by removing the `build/` folder completely.

* `npm run make`: Packages the dizmo as `build/MarkdownReader-x.y.z.dzm` by running all required build tasks and compressing the resulting dizmo as a ZIP archive (but with a `.dzm` extension).

* `npm run install`: Builds and installs the dizmo to the `dizmo/install-to` path (see the `package.json` file). If `install-to` is empty then the dizmo is only built, but not installed.

If any of these steps should fail due to missing dependencies run `npm install` to have them fetched and installed locally.

## Watching

You may want to automatically build and install your dizmo whenever a change is applied. This is possible by running the `watch` run-script in a separate terminal:

    npm run watch

Now, any change in the current directory (except in `build/` and `node_modules/`) will trigger an `install`, which is equivalent to manually running:

    npm run install

The `npm run watch` run-script is *only* available, when the `dizmo:ext`, the `dizmo:ext-coffee-script` or the `dizmo:ext-type-script` sub-generator has been used!

## Testing

By default no test cases nor a test framework are pre-defined:

* `npm run test`: Runs tests (if any) &ndash; but actually the script simply returns an `exit 0` indicating success. If desired, integrate your test framework of choice, write your test cases and override the `test` script in `package.json` accordingly.

  The only requirement is that the main test script should return `0` in case of a successful test run.

## Configuration

The `dizmo` section in `package.json` can be extended with default values, which have to reside in `.generator-dizmo/config.json` (in *any* of the parent directories). For example, to set the credentials and the upload URL for dizmoStore, use the following content:

    {
        "dizmo": {
            "credentials": {
                "password": "my-password",
                "username": "my-username"
            },
            "urls": {
                "upload": "http://store-api.dizmo.com"
            }
        }
    }

The configuration is hierarchical and recursive, i.e. that a `.generator-dizmo/config.json` file can be saved in any parent directory of the current project's path, all of which are then merged during the build dynamically into `package.json`, where configuration files in the lower levels have precedence.

## Versioning

**Important:** Please use semantic versioning by applying `npm version patch` for small patches, `npm version minor` for minor and `npm version major` for major changes! See [NPM's semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning) for further information.
