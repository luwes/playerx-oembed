import { Miniflare } from 'miniflare';

export function create() {
  const mf = new Miniflare({
    envPath: true,
    modules: true,
    buildCommand: undefined,
    scriptPath: './dist/index.js',
  });
  return mf;
}
