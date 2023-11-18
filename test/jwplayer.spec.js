import test from 'ava'
import { create } from './miniflare.js'

test('https://cdn.jwplayer.com/players/Fpw44kH6-IxzuqJ4M.html', async (t) => {
  const mf = create({})
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  t.deepEqual(await res.json(), {
    version: '1.0',
    type: 'video',
    provider_name: 'JWPlayer',
    provider_url: 'https://www.jwplayer.com',
    title: 'Travis Scott - Made in America',
    description:
      'Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!',
    duration: 46,
    upload_date: '2020-03-14T14:21:58.000Z',
    thumbnail_url: 'https://cdn.jwplayer.com/v2/media/Fpw44kH6/poster.jpg?width=720',
    thumbnail_width: 720,
    thumbnail_height: 406,
    html: `
<div id="plx568"></div>
<script src="https://content.jwplatform.com/libraries/IxzuqJ4M.js"></script>
<script>
fetch('https://cdn.jwplayer.com/v2/media/Fpw44kH6')
  .then(function(response) { return response.json(); })
  .then(function(config) {
    (jwplayer(document.querySelector('#plx568')).setup(
      Object.assign(config, {})
    ));
  });
</script>
`,
    width: 1920,
    height: 1080,
  })
})
