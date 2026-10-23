import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assessBindings, assessTrackingTargets } from '../scripts/check-worker-readiness.mjs';

test('empty Worker bindings are not production-ready', () => {
  assert.ok(assessBindings([]).every((check) => !check.ready && check.missing.length));
});

test('Cloudflare Email Sending needs its binding and configured sender', () => {
  const delivery = (names) =>
    assessBindings(names).find((check) => check.name === 'Contact email delivery').ready;
  assert.equal(delivery(['EMAIL', 'CONTACT_FROM_EMAIL']), true);
  assert.equal(delivery(['CONTACT_FROM_EMAIL']), false);
  assert.equal(delivery(['EMAIL']), false);
});

test('checks the remaining email and Turnstile bindings', () => {
  const names = [
    'MAILCHECK_API_KEY',
    'EMAIL',
    'CONTACT_FROM_EMAIL',
    'TURNSTILE_SECRET_KEY',
    'TURNSTILE_SITE_KEY'
  ];
  assert.ok(assessBindings(names).every((check) => check.ready));
});

test('Turnstile requires both its secret and public site key by binding name', () => {
  const turnstile = (names) => assessBindings(names).find((check) => check.name === 'Turnstile');
  assert.deepEqual(turnstile([]).missing, ['TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY']);
  assert.equal(turnstile(['TURNSTILE_SECRET_KEY']).ready, false);
  assert.deepEqual(turnstile(['TURNSTILE_SECRET_KEY']).missing, ['TURNSTILE_SITE_KEY']);
  assert.equal(turnstile(['TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY']).ready, true);
});

test('tracking targets come from published CMS entries', () => {
  assert.equal(assessTrackingTargets(null).ready, false);
  assert.deepEqual(assessTrackingTargets([]).missing.length, 1);
  const rows = [{ kind: 'short_link', key: '*' }];
  assert.equal(assessTrackingTargets(rows).ready, true);
});
