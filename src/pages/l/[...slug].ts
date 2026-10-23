import { trackingRuntimeEnv } from '../../server/worker-runtime';
import {
  extractRequestAndEnv,
  handleInternalRedirectRequest,
  type MailcheckBackendEnv,
  type RouteContextLike
} from '../../server';

export const prerender = false;

export async function GET(
  contextOrRequest: RouteContextLike | Request,
  maybeEnv?: MailcheckBackendEnv
): Promise<Response> {
  const { request, env } = extractRequestAndEnv(contextOrRequest, maybeEnv, trackingRuntimeEnv());
  return handleInternalRedirectRequest(request, env);
}

export const ALL = GET;
export default GET;
