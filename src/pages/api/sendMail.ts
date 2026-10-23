import { env as cloudflareEnv } from 'cloudflare:workers';
import {
  extractRequestAndEnv,
  handleSendMailRequest,
  type MailcheckBackendEnv,
  type RouteContextLike
} from '../../server';

export const prerender = false;

export async function POST(
  contextOrRequest: RouteContextLike | Request,
  maybeEnv?: MailcheckBackendEnv
): Promise<Response> {
  const { request, env } = extractRequestAndEnv(contextOrRequest, maybeEnv, cloudflareEnv);
  return handleSendMailRequest(request, env);
}

export const ALL = POST;
export default POST;
