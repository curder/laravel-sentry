const webpack = require('webpack');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()

// console.log(gitSha);
// console.log(process.env.MIX_SENTRY_FRONTEND_DSN);
// console.log(process.env.APP_ENV);

let devtool = false;
let plugins = [
    new webpack.DefinePlugin({ // 设置环境变量信息
      "process.env.MIX_SENTRY_FRONTEND_DSN": process.env.MIX_SENTRY_FRONTEND_DSN, // the value from .env file, see: https://laravel.com/docs/7.x/mix
      "process.env.MIX_SENTRY_RELEASE": JSON.stringify(gitSha),
      "process.env.MIX_APP_ENVIRONMENT": JSON.stringify(process.env.APP_ENV),
    }),
];

if (process.env.MIX_SENTRY_FRONTED_ENABLED && process.env.NODE_ENV === 'production') {
    devtool = 'source-map';
    plugins.push(
        new SentryCliPlugin({
            include: './public/js',
            ignoreFile: '.sentrycliignore',
            ignore: ['node_modules', 'webpack.config.js', 'webpack.mix.js'],
            configFile: 'sentry.properties',
            urlPrefix: "~/js",
            dryRun: false,
            debug: false, // 是否开启调试
            release: gitSha, // process.env.SENTRY_RELEASE,
            deleteAfterCompile: true,
            setCommits: {
                // repo: "http://github.com/curder/laravel-sentry",
                // commit: gitSha, // JSON.stringify(process.env.SENTRY_RELEASE),
            }
        })
    );
}

module.exports = {
    devtool,
    plugins
}
