import test from 'ava'
import { create } from './miniflare.js'

test('https://share.vidyard.com/watch/TYY9iSji3mJuFqp2oj4FoL', async (t) => {
  const mf = create({})
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  const json = await res.json()
  t.like(json, {
    version: '1.0',
    type: 'video',
    provider_name: 'Vidyard',
    provider_url: 'https://vidyard.com/',
    title: 'Travis Scott - Made in America',
    description: 'Vidyard video',
    duration: 46,
    upload_date: '2020-03-12T04:33:18.000Z',
    thumbnail_url: 'https://play.vidyard.com/TYY9iSji3mJuFqp2oj4FoL.jpg?',
    html: '<iframe id="plx946" src="https://play.vidyard.com/TYY9iSji3mJuFqp2oj4FoL?" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>',
    width: 640,
    height: 360,
    embed_url: 'https://play.vidyard.com/TYY9iSji3mJuFqp2oj4FoL?',
  })
  t.true(
    json.content_url.startsWith(
      'https://cdn.vidyard.com/videos/KXjiP4HHJAnMrT4XDxvfyQ/sd.mp4?',
    ),
  )
})
