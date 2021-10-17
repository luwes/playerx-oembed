import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://www.facebook.com/wesleyluyten/videos/10220940465559072', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
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
    duration: 47,
    upload_date: '2020-02-29T20:53:18.000Z',
    author_name: 'Wesley Luyten',
    author_url: 'https://www.facebook.com/wesleyluyten',
    thumbnail_width: 3840,
    thumbnail_height: 2160,
  })
  t.regex(
    json.thumbnail_url,
    /^https:\/\/scontent-iad3-2.xx.fbcdn.net\/v\/t15.5256-10\/83910444_10220940485319566_2924292779142021120_n.jpg/
  )
  t.regex(
    json.html,
    new RegExp('<div id="fb-root"></div>\\n<script async="1" defer="1" crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v12.0" nonce="\\w+"></script><div class="fb-video" data-href="https://www.facebook.com/wesleyluyten/videos/10220940465559072"><blockquote cite="https://www.facebook.com/wesleyluyten/videos/10220940465559072/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/wesleyluyten/videos/10220940465559072/"></a><p>Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!</p>Posted by <a href="https://www.facebook.com/wesleyluyten">Wesley Luyten</a> on Saturday, February 29, 2020</blockquote></div>')
  )
})
