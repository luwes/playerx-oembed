import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://streamable.com/aizxh', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  const json = await res.json()
  t.like(json, {
    version: '1.0',
    type: 'video',
    provider_name: 'Streamable',
    provider_url: 'https://streamable.com',
    title: 'Travis Scott - Made in America',
    duration: 46.066667,
    upload_date: '2020-02-28T14:29:04.000Z',
    html: '<iframe class="streamable-embed" src="https://streamable.com/o/aizxh" frameborder="0" scrolling="no" width="1920" height="1080" allowfullscreen></iframe>',
    width: 1920,
    height: 1080,
    embed_url: 'https://streamable.com/t/aizxh',
  })
  t.regex(
    json.thumbnail_url,
    /^https:\/\/cdn-cf-east.streamable.com\/image\/aizxh.jpg\?Expires=/,
  )
  t.regex(
    json.content_url,
    /^https:\/\/cdn-cf-east.streamable.com\/video\/mp4\/aizxh.mp4\?Expires=/,
  )
})
