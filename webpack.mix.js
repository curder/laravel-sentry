const mix = require('laravel-mix');

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

mix.webpackConfig(webpack => {
    return {
        plugins: [
            new webpack.DefinePlugin({ // 设置环境变量信息
              "process.env.SENTRY_DNS": JSON.stringify("https://52110924cacd4fd9855f3be5ba3825a1@o73575.ingest.sentry.io/5270899"),
              "process.env.SENTRY_RELEASE": JSON.stringify(process.env.SENTRY_RELEASE), // `git rev-parse HEAD`,
            })
        ]
    };
});
