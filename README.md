## Laravel Sentry

[Sentry](https://sentry.io/) 是一个代码bug追踪平台，使用它可以将代码在执行时发生的错误存储在Sentry，方便后期溯源。

应用上线之后，异常监控和告警是个必须要摆上台面的事情，否则等到用户反馈显得被动不说，而且往往已经是已经导致线上服务不可用一段时间了。

这是我们不想看到的局面，本着早发现早处理，在第一时间及时响应的原则，我们有必要对线上异常和报错有一个实时监控和告警机制，一旦有异常，立即通过邮件等方式通知相关责任人，然后通过实时监控页面排查原因，进而定位问题进行处理。

Sentry 支持多种语言，常见的如：C#、Java、php、Python、Go、Javascript等等，它同时也支持本地部署。

### Laravel项目集成Sentry

### 安装

执行命令下载软件包

``` 
composer require sentry/sentry-laravel
```

### 配置

- 发布配置

    ```
    php artisan vendor:publish --provider="Sentry\Laravel\ServiceProvider"
    ```
    
    修改配置文件`config/sentry.php`内容
    ```
    <?php

    return [

        'dsn' => env('SENTRY_LARAVEL_DSN', env('SENTRY_DSN')),

        // capture release as git sha
        'release' => trim(exec('git --git-dir ' . base_path('.git') . ' log --pretty="%h" -n1 HEAD')),

        'breadcrumbs' => [
            // Capture Laravel logs in breadcrumbs
            'logs' => true,

            // Capture SQL queries in breadcrumbs
            'sql_queries' => true,

            // Capture bindings on SQL queries logged in breadcrumbs
            'sql_bindings' => true,

            // Capture queue job information in breadcrumbs
            'queue_info' => true,

            // Capture command information in breadcrumbs
            'command_info' => true,
        ],

        // @see: https://docs.sentry.io/error-reporting/configuration/?platform=php#send-default-pii
        'send_default_pii' => true,

    ];
    ```

- 本地配置

    配置到 `.env.example` 文件：

    ```
    echo "" >> .env.example                                     
    echo "# Sentry Config" >> .env.example
    echo SENTRY_LARAVEL_ENABLED=true >> .env.example
    echo SENTRY_LARAVEL_DSN= >> .env.example
    ```
    配置到 `.env` 文件：

    ```
    echo "" >> .env                                     
    echo "# Sentry Config" >> .env
    echo SENTRY_LARAVEL_ENABLED=true >> .env
    echo SENTRY_LARAVEL_DSN= >> .env
    ```             

    > 修改对应的`SENTRY_LARAVEL_DNS`[1](#获取Laravel配置部署)的值。


- 编辑 php 文件

    接下里，也是最后一步，编辑 `App/Exceptions/Handler.php` 的 `report` 方法：

    ``` 
    public function report(Exception $exception)
    {
        if (app()->bound('sentry') && $this->shouldReport($exception)) {
            app('sentry')->captureException($exception);
        }

        parent::report($exception);
    }
    ```
- 如果项目有Nova，在`App\Providers\NovaServiceProvider`文件中重写父类的`registerExceptionHandler`方法：
    ```
    /**
     * Register Nova's custom exception handler.
     *
     * @return void
     */
    protected function registerExceptionHandler()
    {
        $this->app->bind(NovaExceptionHandler::class, Handler::class);
    }
    ```

至此配置完毕。

### 测试

#### 方式一 使用命令行
```
php artisan sentry:test
```

#### 方式二 新建路由
在 `routes/web.php` 新建一个路由： 
```
Route::get('/debug-sentry', function() {
    throw new Exception('My first Sentry error!');
});
```
访问，看看是否能在sentry后代获得错误。


### 主动上报错误

#### captureException方法

```
try {
    aaaaaa();
}catch(Throwable $e) {
    Sentry\captureException($e);
}
```

#### 自定义数据

```
try {
    aaaaaa();
}catch(Throwable $e) {
    echo 'Error!';
    // see: https://docs.sentry.io/platforms/php/#extra-context
    Sentry\configureScope(function (Sentry\State\Scope $scope) {
        $scope->setTag('dist.host', 'https://sentry.io');
        $extra =  [
            'status_code' => 401,
            'response_message' => 'Client error: `POST https://URL` resulted in a `401 Unauthorized` response:',
            'api_token' => 'abc',
            'request_url' => 'https://sentry.io/request_url###',
        ];
        collect($extra)->each(function($item, $key) use ($scope) {
            $scope->setExtra($key, $item);
        });
    });

    Sentry\captureException($e);
}
```




## [VueJS项目集成Sentry](/README_VueJS.md)

## 其他

### 获取Laravel配置部署

- 创建项目

  ![](/resources/images/create-project.png)

- 安装和配置

  ![](/resources/images/install-and-configuration.png)

如果忘记了可以在 这个地址：https://sentry.io/settings/<组织>/projects/<项目名>/keys/ 获取。
