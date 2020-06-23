const mix = require('laravel-mix');
const SentryCliPlugin = require('@sentry/webpack-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .extract(['vue', 'lodash', 'axios', 'jquery', 'bootstrap'])
    .version();

const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()

mix.webpackConfig(webpack => {
    return {
        devtool: mix.inProduction() ? 'source-map' : false,
        plugins: [
            new webpack.DefinePlugin({ // 设置环境变量信息
              "process.env.SENTRY_DNS": process.env.MIX_SENTRY_FRONTEND_DSN, // the value from .env file, see: https://laravel.com/docs/7.x/mix
              "process.env.SENTRY_RELEASE": gitSha,
            }),
            () => mix.inProduction() && process.env.MIX_SENTRY_ENABLED ?
                    new SentryCliPlugin({
                              include: './public/js',
                              ignoreFile: '.sentrycliignore',
                              ignore: ['node_modules', 'webpack.config.js', 'webpack.mix.js'],
                              configFile: 'sentry.properties',
                              urlPrefix: "~/js",
                              dryRun: false,
                              debug: true,
                              release: gitSha, // process.env.SENTRY_RELEASE,
                              deleteAfterCompile: true,
                              setCommits: {
                                // repo: "http://github.com/curder/laravel-sentry",
                                // commit: gitSha, // JSON.stringify(process.env.SENTRY_RELEASE),
                              }
                            }) :
                    false,
        ]
    };
});
