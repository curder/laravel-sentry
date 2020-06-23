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
