import { env as cloudflareEnv } from 'cloudflare:workers';
import {
  extractRequestAndEnv,
  handleCheckMailRequest,
  type MailcheckBackendEnv,
  type RouteContextLike
} from '../../server';

export const prerender = false;

export async function POST(
  contextOrRequest: RouteContextLike | Request,
  maybeEnv?: MailcheckBackendEnv
): Promise<Response> {
  const { request, env } = extractRequestAndEnv(contextOrRequest, maybeEnv, cloudflareEnv);
  return handleCheckMailRequest(request, env);
}

export const ALL = POST;
export default POST;
