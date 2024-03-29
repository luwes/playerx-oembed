import test from 'ava'
import { create } from './miniflare.js'

test('https://streamable.com/aizxh', async (t) => {
  const mf = create({})
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
    html: '<iframe id="plx657" src="https://streamable.com/o/aizxh?" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>',
    width: 1920,
    height: 1080,
    embed_url: 'https://streamable.com/o/aizxh?',
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
