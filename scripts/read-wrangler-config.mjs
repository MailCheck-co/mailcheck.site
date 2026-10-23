// wrangler.jsonc has comments; parse it as JSONC and fail closed on errors.
import { readFileSync } from 'node:fs';
import { parse, printParseErrorCode } from 'jsonc-parser';

export function readWranglerConfig(url = new URL('../wrangler.jsonc', import.meta.url)) {
  const errors = [];
  const config = parse(readFileSync(url, 'utf8'), errors, { allowTrailingComma: true });
  if (errors.length) throw new Error(`wrangler.jsonc: ${errors.map((e) => `${printParseErrorCode(e.error)} at ${e.offset}`).join(', ')}`);
  return config;
}
