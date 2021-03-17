const webpack = require('webpack');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim()

// console.log(gitSha);
// console.log(process.env.MIX_SENTRY_FRONTEND_DSN);
// console.log(process.env.APP_ENV);

String.prototype.boolean = function () { // 字符串转boolean
    return (/^true$/i).test(this);
}
const isEnabled = () => {
    return process.env.MIX_SENTRY_FRONTEND_ENABLED.boolean() && process.env.NODE_ENV === 'production';
}

let devtool = false;
let plugins = [
    new webpack.DefinePlugin({ // 设置环境变量信息
      "process.env.SENTRY_FRONTEND_DSN": JSON.stringify(process.env.MIX_SENTRY_FRONTEND_DSN), // the value from .env file, see: https://laravel.com/docs/7.x/mix
      "process.env.SENTRY_RELEASE": JSON.stringify(gitSha),
      "process.env.APP_ENVIRONMENT": process.env.APP_ENV,
      'process.env.SENTRY_FRONTED_ENABLED': isEnabled(),
    }),
];

if ( isEnabled() ) {
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
            setCommits: {
                repo: "http://github.com/curder/laravel-sentry",
                commit: gitSha, // JSON.stringify(process.env.SENTRY_RELEASE),
            }
        })
    );
}
// console.log(devtool, plugins)

module.exports = {
    devtool,
    plugins
}
