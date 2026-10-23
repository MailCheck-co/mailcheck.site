const virtualUrl = 'data:text/javascript,export const env = globalThis.__mailcheckCloudflareEnv ?? {};';

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'cloudflare:workers') {
    return { shortCircuit: true, url: virtualUrl };
  }
  return nextResolve(specifier, context);
}
