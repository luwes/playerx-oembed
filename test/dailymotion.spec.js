import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://www.dailymotion.com/video/x7sgamf', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  const json = await res.json()
  t.like(json, {
    version: '1.0',
    type: 'video',
    provider_name: 'Dailymotion',
    provider_url: 'https://www.dailymotion.com',
    title: 'Travis Scott - Made in America',
    description:
      'Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!',
    duration: 46,
    upload_date: '2020-03-03T14:02:39.000Z',
    author_name: 'dm_0eeae849d4ba20501b1b471a63e76064',
    author_url:
      'https://www.dailymotion.com/dm_0eeae849d4ba20501b1b471a63e76064',
    thumbnail_width: 427,
    thumbnail_height: 240,
    html: '<iframe frameborder="0" width="480" height="269" src="https://www.dailymotion.com/embed/video/x7sgamf" allowfullscreen allow="autoplay"></iframe>',
    width: 480,
    height: 269,
  })
  t.regex(
    json.thumbnail_url,
    /https:\/\/s[123].dmcdn.net\/v\/S4x771W[^/]+\/x240/,
  )
})
