import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://www.youtube.com/watch?v=BK1JIjLPwaA', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  t.deepEqual(await res.json(), {
    version: '1.0',
    type: 'video',
    provider_name: 'YouTube',
    provider_url: 'https://www.youtube.com/',
    title: 'Travis Scott - Made in America',
    author_name: 'Wesley Luyten',
    author_url: 'https://www.youtube.com/c/WesleyLuyten',
    thumbnail_url: 'https://i.ytimg.com/vi/BK1JIjLPwaA/hqdefault.jpg',
    thumbnail_width: 480,
    thumbnail_height: 360,
    html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/BK1JIjLPwaA?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    width: 200,
    height: 113,
    head: [
      {
        type: 'link',
        rel: 'preconnect',
        href: 'https://www.youtube-nocookie.com',
      },
      { type: 'link', rel: 'preconnect', href: 'https://s.ytimg.com' },
    ],
  })
})
