// Worker-only: binds the statically imported runtime env plus the loopback
// stub of the cached `TrackingTargets` entrypoint (exported by src/worker.ts).
import { env, exports } from 'cloudflare:workers';
import type { MailcheckBackendEnv } from './env';

export function trackingRuntimeEnv(): MailcheckBackendEnv {
  const loopback = (exports as unknown as { TrackingTargets?: MailcheckBackendEnv['TRACKING_TARGETS'] }).TrackingTargets;
  return { ...(env as unknown as MailcheckBackendEnv), TRACKING_TARGETS: loopback };
}
