#!/usr/bin/env node
// Guard for `npm run deploy:production`. That deploy attaches the
// mailcheck.co/* route, i.e. it IS the production cutover (and every later
// production release). Require an explicit, typed confirmation so it can never
// run by accident from a shell history, a script or an agent.
const expected = 'mailcheck.co';
if (process.env.CONFIRM_PRODUCTION_DEPLOY !== expected) {
  console.error([
    'Refusing to deploy the production environment.',
    'This attaches the Worker to mailcheck.co/* and makes the site indexable.',
    `Re-run with CONFIRM_PRODUCTION_DEPLOY=${expected} once the cutover checklist`,
    'in docs/cloudflare-migration.md is signed off.'
  ].join('\n'));
  process.exit(1);
}
console.log('Production deploy confirmed for mailcheck.co.');
