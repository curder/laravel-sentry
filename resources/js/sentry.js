import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

Sentry.init({
    dsn: process.env.SENTRY_DNS,
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
