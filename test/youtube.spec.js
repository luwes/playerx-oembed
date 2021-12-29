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
    description: 'Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!',
    duration: 47,
    upload_date: '2020-02-08T00:00:00.000Z',
    author_name: 'Wesley Luyten',
    author_url: 'https://www.youtube.com/c/WesleyLuyten',
    thumbnail_url: 'https://i.ytimg.com/vi/BK1JIjLPwaA/hqdefault.jpg',
    thumbnail_width: 480,
    thumbnail_height: 360,
    html: '<iframe id="plx145" src="https://www.youtube.com/embed/BK1JIjLPwaA?" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>',
    width: 200,
    height: 113,
    embed_url: 'https://www.youtube.com/embed/BK1JIjLPwaA?',
  })
})
