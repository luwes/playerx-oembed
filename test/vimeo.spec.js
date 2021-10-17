import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://vimeo.com/357274789', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  t.deepEqual(await res.json(), {
    version: '1.0',
    type: 'video',
    provider_name: 'Vimeo',
    provider_url: 'https://vimeo.com/',
    title: 'Travis Scott - Made in America',
    description:
      'Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!',
    duration: 46,
    upload_date: '2019-09-01T23:41:58.000Z',
    author_name: 'Wesley Luyten',
    author_url: 'https://vimeo.com/luwes',
    thumbnail_url: 'https://i.vimeocdn.com/video/810965406-a3ff82ba6dcf55973dcc42f561664c4275594fb2505f849e27da7672795a288d-d_295x166',
    thumbnail_width: 295,
    thumbnail_height: 166,
    html: '<iframe src="https://player.vimeo.com/video/357274789?h=34cffe2833&amp;app_id=122963" width="426" height="240" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Travis Scott - Made in America"></iframe>',
    width: 426,
    height: 240,
    is_plus: '0',
    account_type: 'live_business',
    thumbnail_url_with_play_button:
      'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F810965406-a3ff82ba6dcf55973dcc42f561664c4275594fb2505f849e27da7672795a288d-d_295x166&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png',
    video_id: 357274789,
    uri: '/videos/357274789',
    head: [
      { type: 'link', rel: 'preconnect', href: 'https://player.vimeo.com' },
      { type: 'link', rel: 'preconnect', href: 'https://i.vimeocdn.com' },
      { type: 'link', rel: 'preconnect', href: 'https://f.vimeocdn.com' },
    ],
  })
})
