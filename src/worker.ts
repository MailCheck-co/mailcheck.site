import handler, { createScheduledHandler, PluginBridge } from '@emdash-cms/cloudflare/worker';
import { finalizeResponse, legacyRedirect, type EdgeEnv } from './server/edge';

export { PluginBridge };
export { TrackingTargets } from './server/tracking-targets-entrypoint';

export default {
  ...handler,
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const redirect = legacyRedirect(url);
    const response = redirect ?? await handler.fetch!(request as never, env, ctx);
    return finalizeResponse(response, url, env as EdgeEnv);
  },
  scheduled: createScheduledHandler()
} satisfies ExportedHandler;
