import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readWranglerConfig } from './read-wrangler-config.mjs';

export function assessBindings(names) {
  const available = new Set(names);
  const missing = (keys) => keys.filter((key) => !available.has(key));
  const hasCloudflareEmail = available.has('EMAIL');
  const hasSender = available.has('CONTACT_FROM_EMAIL');
  return [
    {
      name: 'Email validation',
      ready: available.has('MAILCHECK_API_KEY'),
      missing: missing(['MAILCHECK_API_KEY'])
    },
    {
      name: 'Contact email delivery',
      ready: hasCloudflareEmail && hasSender,
      missing: [
        ...(!hasCloudflareEmail ? ['EMAIL send_email binding'] : []),
        ...(!hasSender
          ? ['CONTACT_FROM_EMAIL (sender on an onboarded Cloudflare Email Sending domain)']
          : [])
      ]
    },
    {
      name: 'Turnstile',
      ready: missing(['TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY']).length === 0,
      missing: missing(['TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY'])
    }
  ];
}

/**
 * Tracking targets are CMS data (`tracking_targets`), not bindings.
 */
export function assessTrackingTargets(rows) {
  if (!rows)
    return {
      name: 'Tracking targets (CMS)',
      ready: false,
      missing: ['tracking_targets collection (run npm run cms:tracking)']
    };
  const has = (kind, key) =>
    rows.some((row) => row.kind === kind && (key === undefined || row.key === key));
  const missing = has('short_link') ? [] : ['short_link entry (usually key *)'];
  const counts = `short_link: ${rows.filter((row) => row.kind === 'short_link').length}`;
  return {
    name: `Tracking targets (CMS; published ${counts})`,
    ready: missing.length === 0,
    missing
  };
}

function readTrackingTargets(cli, cwd, database) {
  try {
    // Read-only query: kinds and keys only.
    const output = execFileSync(
      process.execPath,
      [
        cli,
        'd1',
        'execute',
        database,
        '--remote',
        '--json',
        '--command',
        "SELECT kind, key FROM ec_tracking_targets WHERE status = 'published' AND deleted_at IS NULL"
      ],
      {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );
    return JSON.parse(output)[0]?.results ?? [];
  } catch {
    return null;
  }
}

export function checkWorkerReadiness() {
  const config = readWranglerConfig();
  if (
    config.account_id !== '2c9835fef0d4f0bacd0ffe1399957f42' ||
    config.name !== 'mailcheck-site'
  ) {
    throw new Error('Unexpected Worker/account. Refusing readiness check.');
  }
  const cli = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
  // secret list returns names/types, never values. Keep subprocess output private.
  const output = execFileSync(process.execPath, [cli, 'secret', 'list', '--format', 'json'], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const secrets = JSON.parse(output);
  const names = [
    ...secrets.map((secret) => secret.name),
    ...Object.keys(config.vars ?? {}),
    ...(config.send_email ?? []).map((binding) => binding.name)
  ];
  console.log(`Worker: ${config.name}; account: ${config.account_id}`);
  console.log(
    'Binding-name presence only: this does NOT validate credentials, JSON contents, permissions, or external delivery.'
  );
  const checks = [
    ...assessBindings(names),
    assessTrackingTargets(
      readTrackingTargets(
        cli,
        fileURLToPath(new URL('../', import.meta.url)),
        config.d1_databases[0].database_name
      )
    )
  ];
  for (const check of checks) {
    console.log(`${check.ready ? 'PRESENT' : 'MISSING'} ${check.name}`);
    for (const name of check.missing) console.log(`  ${name}`);
  }
  console.log(
    `CMS encryption key: ${
      names.includes('EMDASH_ENCRYPTION_KEY')
        ? 'present'
        : 'not set (needed before storing CMS provider/plugin secrets)'
    }`
  );
  if (checks.some((check) => !check.ready)) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    checkWorkerReadiness();
  } catch {
    console.error(
      'Unable to check readiness; verify Wrangler login and configuration. No credential values were printed.'
    );
    process.exitCode = 1;
  }
}
