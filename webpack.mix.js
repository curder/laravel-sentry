const mix = require('laravel-mix');
const sentryConfig = require('./webpack.sentry.config');
mix.webpackConfig(sentryConfig);
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
