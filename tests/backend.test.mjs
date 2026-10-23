import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, it, before, beforeEach } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Allow Node's native TypeScript loader to resolve extensionless relative imports in src/
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      !path.extname(specifier) &&
      context.parentURL
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const candidateTs = path.resolve(parentDir, `${specifier}.ts`);
      if (existsSync(candidateTs)) {
        return nextResolve(pathToFileURL(candidateTs).href, context);
      }
      const candidateIndexTs = path.resolve(parentDir, specifier, 'index.ts');
      if (existsSync(candidateIndexTs)) {
        return nextResolve(pathToFileURL(candidateIndexTs).href, context);
      }
    }
    return nextResolve(specifier, context);
  }
});

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'cloudflare:workers') {
      return {
        shortCircuit: true,
        url: 'data:text/javascript,export const env = globalThis.__mailcheckCloudflareEnv ?? {}; export const exports = globalThis.__mailcheckCloudflareExports ?? {};'
      };
    }
    return nextResolve(specifier, context);
  }
});

globalThis.__mailcheckCloudflareEnv = {};
// Mutated in place by tests: the stub module captures this object at import.
globalThis.__mailcheckCloudflareExports = {};

/** Stand-in for the cached `TrackingTargets` loopback entrypoint. */
function trackingTargets(partial) {
  const table = { short_link: {}, ...partial };
  return { fetch: async () => Response.json(table) };
}

const server = await import('../src/server/index.ts');
const checkMailRoute = await import('../src/pages/api/checkMail.ts');
const sendMailRoute = await import('../src/pages/api/sendMail.ts');
const internalRedirectRoute = await import('../src/pages/l/[...slug].ts');

let testPrivateKeyPem = '';
let serviceAccountJson = '';

async function generateTestPemKey() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['sign', 'verify']
  );
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const base64 = Buffer.from(pkcs8).toString('base64');
  return `-----BEGIN PRIVATE KEY-----\n${base64}\n-----END PRIVATE KEY-----`;
}

describe('Cloudflare-compatible Mailcheck Backend', () => {
  before(async () => {
    testPrivateKeyPem = await generateTestPemKey();
    serviceAccountJson = JSON.stringify({
      client_email: 'mailcheck-test@test-project.iam.gserviceaccount.com',
      private_key: testPrivateKeyPem,
      project_id: 'test-project'
    });
  });

  beforeEach(() => {
    server.defaultEmailValidator.reset();
    server.resetTrackingCaches();
  });

  describe('/api/checkMail & EmailValidator', () => {
    it('handles Astro v6+ @astrojs/cloudflare throwing locals.runtime.env getter gracefully', async () => {
      const locals = {};
      Object.defineProperty(locals, 'runtime', {
        enumerable: false,
        value: {
          get env() {
            throw new Error('Astro.locals.runtime.env has been removed in Astro v6.');
          }
        }
      });
      const req = new Request('https://mailcheck.co/api/checkMail', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({})
      });
      const res = await checkMailRoute.POST({ request: req, locals });
      assert.equal(res.status, 400);
    });

    it('reads static cloudflare:workers bindings deterministically on the first route request', async () => {
      globalThis.__mailcheckCloudflareEnv.MAILCHECK_API_KEY = 'cold-start-key';
      let authorization = '';
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (_url, init) => {
        authorization = init.headers.authorization;
        return new Response(JSON.stringify({ email: 'first@example.com', trustRate: 80 }), {
          status: 200
        });
      };
      try {
        const req = new Request('https://mailcheck.co/api/checkMail', {
          method: 'POST',
          body: JSON.stringify({ email: 'first@example.com' })
        });
        const res = await checkMailRoute.POST({ request: req, locals: {} });
        assert.equal(res.status, 200);
        assert.equal(authorization, 'Bearer cold-start-key');
      } finally {
        delete globalThis.__mailcheckCloudflareEnv.MAILCHECK_API_KEY;
        globalThis.fetch = originalFetch;
      }
    });

    it('returns 400 when email is missing', async () => {
      const req = new Request('https://mailcheck.co/api/checkMail', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({})
      });
      const res = await checkMailRoute.POST({ request: req, locals: { runtime: { env: {} } } });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.deepEqual(data, {
        code: '400',
        message: 'Bad request: no email passed'
      });
    });

    it('validates email via Mailcheck API, caches result, and enforces IP rate limit', async () => {
      let upstreamCalls = 0;
      const mockFetch = async (url, init) => {
        upstreamCalls++;
        assert.equal(url, 'https://api.mailcheck.co/v1/singleEmail:check');
        assert.equal(init.headers.authorization, 'Bearer test-key');
        assert.equal(init.headers['user-agent'], 'mailcheck landing');
        const body = JSON.parse(init.body);
        return new Response(
          JSON.stringify({
            email: body.email,
            trustRate: 85,
            mxExists: true,
            smtpExists: true,
            isNotDisposable: true,
            isNotSmtpCatchAll: true
          }),
          { status: 200, headers: { 'content-type': 'application/json' } }
        );
      };

      const env = { MAILCHECK_API_KEY: 'test-key' };
      const validator = new server.EmailValidator();

      // First call hits upstream
      const req1 = new Request('https://mailcheck.co/api/checkMail', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'cf-connecting-ip': '203.0.113.5'
        },
        body: JSON.stringify({ email: 'alice@example.com' })
      });
      const res1 = await server.handleCheckMailRequest(req1, env, validator, mockFetch);
      assert.equal(res1.status, 200);
      assert.equal(upstreamCalls, 1);

      // Second call for same email is served from mailCache without incrementing upstreamCalls
      const req1Cached = new Request('https://mailcheck.co/api/checkMail', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'cf-connecting-ip': '203.0.113.5'
        },
        body: JSON.stringify({ email: 'alice@example.com' })
      });
      const res1Cached = await server.handleCheckMailRequest(req1Cached, env, validator, mockFetch);
      assert.equal(res1Cached.status, 200);
      assert.equal(upstreamCalls, 1);

      // Every request counts, including the cached request. Unique calls 2..7 still succeed.
      for (let i = 2; i <= 7; i++) {
        const reqN = new Request('https://mailcheck.co/api/checkMail', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'cf-connecting-ip': '203.0.113.5'
          },
          body: JSON.stringify({ email: `user${i}@example.com` })
        });
        const resN = await server.handleCheckMailRequest(reqN, env, validator, mockFetch);
        assert.equal(resN.status, 200);
      }

      // The ninth total request exceeds the legacy isolate-local threshold.
      const req9 = new Request('https://mailcheck.co/api/checkMail', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'cf-connecting-ip': '203.0.113.5'
        },
        body: JSON.stringify({ email: 'user8@example.com' })
      });
      const res9 = await server.handleCheckMailRequest(req9, env, validator, mockFetch);
      assert.equal(res9.status, 429);
      const err9 = await res9.json();
      assert.deepEqual(err9, {
        code: '429',
        message: 'rate limit reached for ip 203.0.113.5'
      });
    });
  });

  describe('/api/sendMail & Contact Mail Sender', () => {
    it('returns 400 on invalid JSON payload', async () => {
      const req = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        body: 'not-json{'
      });
      const res = await sendMailRoute.POST({ request: req, locals: { runtime: { env: {} } } });
      assert.equal(res.status, 400);
      assert.deepEqual(await res.json(), { error: 'wrong input params (json expected)' });
    });

    it('returns 412 when email trustRate is below threshold 40', async () => {
      const mockFetch = async () =>
        new Response(JSON.stringify({ email: 'low@example.com', trustRate: 39 }), {
          status: 200
        });

      const req = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test',
          email: 'low@example.com',
          subject: 'Hello'
        })
      });
      const res = await server.handleSendMailRequest(
        req,
        { MAILCHECK_API_KEY: 'key' },
        new server.EmailValidator(),
        mockFetch
      );
      assert.equal(res.status, 412);
      assert.deepEqual(await res.json(), { email: 'low@example.com', trustRate: 39 });
    });

    it('enforces contact body/field caps and optional Workers rate limiting', async () => {
      const oversized = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        body: JSON.stringify({ email: 'a@example.com', subject: 'x'.repeat(10_001) })
      });
      assert.equal((await server.handleSendMailRequest(oversized, {})).status, 400);

      let key = '';
      const limited = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        headers: { 'cf-connecting-ip': '203.0.113.9' },
        body: JSON.stringify({ email: 'a@example.com' })
      });
      const res = await server.handleSendMailRequest(limited, {
        CONTACT_RATE_LIMITER: {
          limit: async ({ key: value }) => ((key = value), { success: false })
        }
      });
      assert.equal(key, '203.0.113.9');
      assert.equal(res.status, 429);
      assert.deepEqual(await res.json(), {
        code: '429',
        message: 'rate limit reached for ip 203.0.113.9'
      });
    });

    it('keeps contact behavior unchanged when no Turnstile secret is configured', async () => {
      let validatorCalls = 0;
      const validator = {
        validate: async () => (validatorCalls++, { code: 200, data: { trustRate: 40 } })
      };
      const req = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        body: JSON.stringify({ email: 'valid@example.com' })
      });
      const res = await server.handleSendMailRequest(req, {}, validator, async () => {
        throw new Error('Sender is intentionally unconfigured');
      });
      assert.equal(res.status, 500);
      assert.equal(validatorCalls, 1);
    });

    it('accepts a valid Turnstile contact token before validation and email delivery', async () => {
      const calls = [];
      let sentMessage = null;
      const mockFetch = async (url, init) => {
        calls.push(url);
        if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
          const body = new URLSearchParams(init.body);
          assert.equal(body.get('secret'), 'turnstile-secret');
          assert.equal(body.get('response'), 'valid-token');
          assert.equal(body.get('remoteip'), '203.0.113.12');
          assert.ok(body.get('idempotency_key'));
          return new Response(
            JSON.stringify({
              success: true,
              action: 'contact',
              hostname: 'mailcheck.co'
            }),
            { status: 200 }
          );
        }
        throw new Error(`Unexpected URL: ${url}`);
      };
      const validator = { validate: async () => ({ code: 200, data: { trustRate: 80 } }) };
      const req = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        headers: { 'cf-connecting-ip': '203.0.113.12' },
        body: JSON.stringify({ email: 'valid@example.com', turnstileToken: 'valid-token' })
      });
      const res = await server.handleSendMailRequest(
        req,
        {
          TURNSTILE_SECRET_KEY: 'turnstile-secret',
          CONTACT_FROM_EMAIL: 'sender@example.com',
          EMAIL: {
            send(message) {
              sentMessage = message;
              return Promise.resolve({ messageId: 'msg-123' });
            }
          }
        },
        validator,
        mockFetch
      );
      assert.equal(res.status, 200);
      assert.deepEqual(calls, ['https://challenges.cloudflare.com/turnstile/v0/siteverify']);
      assert.equal(sentMessage.to, 'contact@mailcheck.co');
    });

    it('returns 403 for a missing or failed Turnstile token without consuming rate limit', async () => {
      let limiterCalls = 0;
      let fetchCalls = 0;
      const env = {
        TURNSTILE_SECRET_KEY: 'turnstile-secret',
        CONTACT_RATE_LIMITER: { limit: async () => (limiterCalls++, { success: true }) }
      };
      const missing = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        headers: { 'cf-connecting-ip': '203.0.113.13' },
        body: JSON.stringify({ email: 'valid@example.com' })
      });
      const missingRes = await server.handleSendMailRequest(missing, env, undefined, async () => {
        fetchCalls++;
        throw new Error('not expected');
      });
      assert.equal(missingRes.status, 403);
      assert.deepEqual(await missingRes.json(), { error: 'turnstile verification failed' });

      const failed = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        headers: { 'cf-connecting-ip': '203.0.113.13' },
        body: JSON.stringify({ email: 'valid@example.com', turnstileToken: 'bad-token' })
      });
      const failedRes = await server.handleSendMailRequest(failed, env, undefined, async () => {
        fetchCalls++;
        return new Response(JSON.stringify({ success: false }), { status: 200 });
      });
      assert.equal(failedRes.status, 403);
      assert.equal(limiterCalls, 0);
      assert.equal(fetchCalls, 1);
    });

    it('returns 403 for a wrong Turnstile action or hostname', async () => {
      for (const verification of [
        { success: true, action: 'login', hostname: 'mailcheck.co' },
        { success: true, action: 'contact', hostname: 'attacker.example' }
      ]) {
        const req = new Request('https://mailcheck.co/api/sendMail', {
          method: 'POST',
          body: JSON.stringify({ email: 'valid@example.com', turnstileToken: 'token' })
        });
        const res = await server.handleSendMailRequest(
          req,
          { TURNSTILE_SECRET_KEY: 'turnstile-secret' },
          undefined,
          async () => new Response(JSON.stringify(verification), { status: 200 })
        );
        assert.equal(res.status, 403);
      }
    });

    it('fails closed with 503 when Turnstile siteverify is unavailable', async () => {
      for (const mockFetch of [
        async () => new Response('upstream unavailable', { status: 503 }),
        async () => {
          throw new Error('network failure');
        }
      ]) {
        const req = new Request('https://mailcheck.co/api/sendMail', {
          method: 'POST',
          body: JSON.stringify({ email: 'valid@example.com', turnstileToken: 'token' })
        });
        const res = await server.handleSendMailRequest(
          req,
          { TURNSTILE_SECRET_KEY: 'turnstile-secret' },
          undefined,
          mockFetch
        );
        assert.equal(res.status, 503);
        assert.deepEqual(await res.json(), { error: 'turnstile verification unavailable' });
      }
    });

    it('fails with 500 when sender is not configured (does not pretend success)', async () => {
      const mockFetch = async () =>
        new Response(JSON.stringify({ email: 'valid@example.com', trustRate: 40 }), {
          status: 200
        });

      const req = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice',
          email: 'valid@example.com',
          subject: 'Need help'
        })
      });
      const res = await server.handleSendMailRequest(
        req,
        { MAILCHECK_API_KEY: 'key' },
        new server.EmailValidator(),
        mockFetch
      );
      assert.equal(res.status, 500);
      const body = await res.json();
      assert.match(body.error, /not configured/i);
    });

    it('sends an HTML-escaped contact email via Cloudflare Email Sending when trustRate >= 40', async () => {
      let sentMessage = null;
      const mockFetch = async (url, init) => {
        if (url === 'https://api.mailcheck.co/v1/singleEmail:check') {
          return new Response(JSON.stringify({ email: 'valid@example.com', trustRate: 40 }), {
            status: 200
          });
        }
        throw new Error(`Unexpected URL: ${url}`);
      };

      const req = new Request('https://mailcheck.co/api/sendMail', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice <script>alert("xss")</script>',
          email: 'valid@example.com',
          subject: 'Quote " & \' test'
        })
      });

      const res = await server.handleSendMailRequest(
        req,
        {
          MAILCHECK_API_KEY: 'key',
          CONTACT_FROM_EMAIL: 'sender@mailcheck.co',
          EMAIL: {
            send(message) {
              sentMessage = message;
              return Promise.resolve({ messageId: 'msg-123' });
            }
          }
        },
        new server.EmailValidator(),
        mockFetch
      );

      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { data: 'ok' });
      assert.deepEqual(sentMessage.from, {
        email: 'sender@mailcheck.co',
        name: 'Mailcheck Landing'
      });
      assert.equal(sentMessage.to, 'contact@mailcheck.co');
      assert.match(sentMessage.text, /name: Alice <script>alert\("xss"\)<\/script>/);
      assert.ok(
        sentMessage.html.includes(
          '<p><b>name: </b>Alice &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>'
        )
      );
      assert.ok(sentMessage.html.includes('<p><b>subject: </b>Quote &quot; &amp; &#39; test</p>'));
    });
  });

  describe('/l/[...slug] Internal Redirects', () => {
    it('resolves the CMS short link and merges query params', async () => {
      const mockFetch = async (url) => {
        throw new Error(`Unexpected URL: ${url}`);
      };

      const req = new Request('https://mailcheck.co/l/fb?utm_source=footer', {
        headers: {
          'User-Agent': 'TestBrowser/1.0',
          'CF-Connecting-IP': '198.51.100.7',
          'CF-IPCountry': 'US',
          Referer: 'https://mailcheck.co/'
        }
      });

      const res = await server.handleInternalRedirectRequest(
        req,
        {
          TRACKING_TARGETS: trackingTargets({
            short_link: {
              '*': 'https://mailcheck.co/404',
              fb: 'https://www.facebook.com/mailcheck.co/'
            }
          })
        },
        mockFetch
      );

      assert.equal(res.status, 200);
      const html = await res.text();
      assert.ok(
        html.includes(
          'content="0;URL=\'https://www.facebook.com/mailcheck.co/?from=fb&utm_source=footer\'"'
        )
      );
    });
  });
});
