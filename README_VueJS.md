## Vue项目集成Sentry

### 安装

```
yarn add @sentry/browser --dev
yarn add @sentry/integrations --dev
```                                

## 配置

- 本地配置

    配置到 `.env.example` 文件：

    ```
    MIX_SENTRY_FRONTEND_ENABLED=false
    MIX_SENTRY_FRONTEND_DSN=
    ```
    配置到 `.env` 文件：

    ```
    MIX_SENTRY_FRONTEND_ENABLED=true
    MIX_SENTRY_FRONTEND_DSN=
    ```             

    > 修改 `.env` 文件对应的`MIX_SENTRY_FRONTEND_DSN`[1](#获取Vue配置部署)的值。

    新增文件，`resources/js/sentry.js`，内容如下：
    ```js
    import Vue from 'vue'
    import * as Sentry from '@sentry/browser';
    import * as Integrations from '@sentry/integrations';
    
    // console.log(process.env.SENTRY_FRONTEND_DSN);
    // console.log(process.env.SENTRY_RELEASE);
    // console.log(process.env.APP_ENVIRONMENT);
    // console.log(process.env.NODE_ENV);
    // console.log(process.env.SENTRY_FRONTED_ENABLED);
    
    Sentry.init({
      enabled: process.env.SENTRY_FRONTED_ENABLED,
      dsn: process.env.SENTRY_FRONTEND_DSN,
      integrations: [
        new Integrations.Vue({
          Vue,
          attachProps: true,
          logErrors: true,
          tracing: true,
          tracingOptions: {
            trackComponents: true,
          }
        })
      ],
      release: process.env.SENTRY_RELEASE,
      environment: process.env.NODE_ENV,
    });
    
    // 在捕获错误的界面需要用到Sentry
    Vue.prototype.Sentry = Sentry
    ```
    
    在项目根目录下新增文件`webpack.sentry.config.js`，内容如下：
    ```
    yarn add @sentry/webpack-plugin --dev
    ```
    
    ```js
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
        return process.env.MIX_SENTRY_FRONTED_ENABLED.boolean() && process.env.NODE_ENV === 'production';
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
                release: gitSha // process.env.SENTRY_RELEASE,
            })
        );
    }
    // console.log(devtool, plugins)
    
    module.exports = {
        devtool,
        plugins
    }
    ```    
  
    修改`webpack.mix.js`文件：
    
    ```js
    const mix = require('laravel-mix');
    const sentryConfig = require('./webpack.sentry.config');
    mix.webpackConfig(sentryConfig);
    ```                
  
    创建 `.sentryclirc` 文件内容
    ```
    [defaults]
    url = 'https://sentry.io'      # 对应自定义的域名
    org = 'curder-sentry'          # 组织名
    project = 'laravel-vue-sentry' # 项目名
    
    [auth]
    token=                         # token
    ```
    > 在 [页面](https://sentry.io/settings/account/api/auth-tokens/)右上角 [创建新的令牌](https://sentry.io/settings/account/api/auth-tokens/new-token/)
    主要是 `project:write` 勾选上，其他默认即可。点击创建令牌，将生成的新令牌填写到`.sentryclirc`的`token`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    
    删除`*.map.js`文件
    
    ```
    yarn add rimraf --dev
    # 在 package.json 文件的 production 命令中新增  && rimraf public/js/*.js.map 即可。 
    ```
    

## 一些说明

如果需要关闭和开启sentry追踪，修改`.env`中`MIX_SENTRY_FRONTED_ENABLED`的值。为`true`则开启，为`false`则关闭。

> 修改了配置需要重新执行`yarn prod` 或者 `yarn watch` 编译脚本，才能生效


## [Laravel项目集成Sentry](/README.md) 


### 获取Vue配置部署

- 创建项目
  ![](/resources/images/create-project-for-vuejs.png)
  
- 安装和配置
  ![](/resources/images/install-and-configuration-for-vuejs.png)


