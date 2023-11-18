import test from 'ava'
import { create } from './miniflare.js'

test.beforeEach((t) => {
  const mf = create({})
  t.context = { mf }
})

test('url parameter is required', async (t) => {
  const { mf } = t.context
  const res = await mf.dispatchFetch('http://localhost:8787/')
  t.is(await res.text(), 'url parameter is required')
})
