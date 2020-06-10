import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import {Vue as VueIntegration} from '@sentry/integrations';

Sentry.init({
    dsn: 'https://52110924cacd4fd9855f3be5ba3825a1@o73575.ingest.sentry.io/5270899',
    integrations: [new VueIntegration({Vue, attachProps: true, logErrors: true})],
});
