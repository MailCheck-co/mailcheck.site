import type { MailcheckBackendEnv } from './env';
import { getClientIp, jsonResponse } from './http';

export const DEFAULT_MAILCHECK_API_URL = 'https://api.mailcheck.co/v1/singleEmail:check';
export const DEFAULT_MAILCHECK_API_KEY = 'apiKey';
export const DEFAULT_CALL_LIMIT_PER_IP = 7;

export interface ValidationResult {
  code: number;
  data: Record<string, unknown>;
}

export class EmailValidator {
  callLimitForOneIp: number;
  ipCache: Map<string | undefined, number>;
  mailCache: Map<string, Record<string, unknown>>;

  constructor(callLimitForOneIp = DEFAULT_CALL_LIMIT_PER_IP) {
    this.callLimitForOneIp = callLimitForOneIp;
    this.ipCache = new Map();
    this.mailCache = new Map();
  }

  reset(): void {
    this.ipCache.clear();
    this.mailCache.clear();
  }

  async validate(
    email: string,
    reqIp?: string,
    env?: MailcheckBackendEnv,
    fetchImpl: typeof fetch = fetch,
    skipLocalRateLimit = false
  ): Promise<ValidationResult> {
    if (!skipLocalRateLimit) {
      const reqCount = this.ipCache.get(reqIp) || 0;
      this.ipCache.set(reqIp, reqCount + 1);

      if (reqCount > this.callLimitForOneIp) {
        return {
          code: 429,
          data: {
            code: '429',
            message: 'rate limit reached for ip ' + reqIp
          }
        };
      }
    }

    const cachedResult = this.mailCache.get(email);
    if (cachedResult) {
      return {
        code: 200,
        data: cachedResult
      };
    }

    const apiLink = env?.MAILCHECK_API_URL || DEFAULT_MAILCHECK_API_URL;
    const apiKey = env?.MAILCHECK_API_KEY || DEFAULT_MAILCHECK_API_KEY;

    try {
      const apires = await fetchImpl(apiLink, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + apiKey,
          'user-agent': 'mailcheck landing'
        },
        body: JSON.stringify({ email })
      });

      const json = (await apires.json()) as Record<string, unknown>;
      if (apires.ok) {
        this.mailCache.set(email, json);
      }

      return {
        code: apires.status,
        data: json
      };
    } catch (err) {
      return {
        code: 500,
        data: {
          code: '500',
          message: err instanceof Error ? err.toString() : String(err)
        }
      };
    }
  }
}

export const defaultEmailValidator = new EmailValidator();

export async function handleCheckMailRequest(
  request: Request,
  env: MailcheckBackendEnv,
  validator: EmailValidator = defaultEmailValidator,
  fetchImpl: typeof fetch = fetch
): Promise<Response> {
  let body: Record<string, unknown> | null = null;
  try {
    const rawText = await request.text();
    if (rawText) {
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>;
      }
    }
  } catch {
    body = null;
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!email) {
    return jsonResponse(
      {
        code: '400',
        message: 'Bad request: no email passed'
      },
      400
    );
  }

  const reqIp = getClientIp(request);
  const { code, data } = await validator.validate(email, reqIp, env, fetchImpl);
  return jsonResponse(data, code);
}
