import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://share.vidyard.com/watch/TYY9iSji3mJuFqp2oj4FoL', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  const json = await res.json()
  t.like(json, {
    version: '1.0',
    type: 'video',
    provider_name: 'Vidyard',
    provider_url: 'https://vidyard.com/',
    title: 'Travis Scott - Made in America',
    description: '',
    duration: 46,
    upload_date: '2020-03-12T04:33:18.000Z',
    thumbnail_url: 'https://play.vidyard.com/TYY9iSji3mJuFqp2oj4FoL.jpg?',
    html: '<script type="text/javascript" async src="https://play.vidyard.com/embed/v4.js"></script>\n<img\n  style="width: 100%; margin: auto; display: block;"\n  class="vidyard-player-embed"\n  src="https://play.vidyard.com/TYY9iSji3mJuFqp2oj4FoL.jpg"\n  data-uuid="TYY9iSji3mJuFqp2oj4FoL"\n  data-v="4"\n  data-type="inline"\n  data-width="640"\n  data-height="360"\n/>',
    width: 640,
    height: 360,
    embed_url:
      'https://play.vidyard.com/TYY9iSji3mJuFqp2oj4FoL.html?autoplay=0&amp;custom_id=&amp;embed_button=0&amp;viral_sharing=0&amp;',
  })
  t.true(
    json.content_url.startsWith(
      'https://cdn.vidyard.com/videos/KXjiP4HHJAnMrT4XDxvfyQ/sd.mp4?',
    ),
  )
})
