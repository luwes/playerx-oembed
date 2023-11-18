import test from 'ava'
import { create } from './miniflare.js'

test('https://www.facebook.com/wesleyluyten/videos/10220940465559072', async (t) => {
  const mf = create({})
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  const json = await res.json();
  t.like(json, {
    version: '1.0',
    type: 'video',
    provider_name: 'Facebook',
    provider_url: 'https://www.facebook.com/',
    title: 'Wesley Luyten',
    description:
      'Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!',
    duration: undefined,
    upload_date: undefined,
    author_name: 'Wesley Luyten',
    author_url: 'https://www.facebook.com/wesleyluyten',
    thumbnail_width: undefined,
    thumbnail_height: undefined,
    thumbnail_url: undefined,
    html: '<iframe id="plx555" src="https://www.facebook.com/v3.2/plugins/video.php?href=https://www.facebook.com/wesleyluyten/videos/10220940465559072&allowfullscreen=true&" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>'
  })
  // t.regex(
  //   json.thumbnail_url,
  //   /^https:\/\/scontent-iad3-\d.xx.fbcdn.net\/v\/t15.5256-10\/(.*?\/)?83910444_10220940485319566_2924292779142021120_n.jpg/
  // )
})
