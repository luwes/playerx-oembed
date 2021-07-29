import test from 'ava'
import { Miniflare } from 'miniflare'

test.beforeEach((t) => {
  const mf = new Miniflare({
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
  })
  t.context = { mf }
})

test('url parameter is required', async (t) => {
  const { mf } = t.context
  const res = await mf.dispatchFetch('http://localhost:8787/')
  t.is(await res.text(), 'url parameter is required')
})
