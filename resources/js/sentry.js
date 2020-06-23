import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

// console.log(process.env.MIX_SENTRY_FRONTEND_DSN);
// console.log(process.env.MIX_SENTRY_RELEASE);
// console.log(process.env.MIX_APP_ENVIRONMENT);
// console.log(process.env.NODE_ENV);

Sentry.init({
    dsn: process.env.MIX_SENTRY_FRONTEND_DSN,
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
  release: process.env.MIX_SENTRY_RELEASE,
  environment: process.env.NODE_ENV,
});

// 在捕获错误的界面需要用到Sentry
Vue.prototype.Sentry = Sentry
