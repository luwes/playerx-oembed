import test from 'ava'
import { Miniflare } from 'miniflare'

test('https://cdn.jwplayer.com/players/Fpw44kH6-IxzuqJ4M.html', async (t) => {
  const mf = new Miniflare({ buildCommand: undefined })
  const res = await mf.dispatchFetch(`http://localhost:8787/?url=${t.title}`)
  t.deepEqual(await res.json(), {"version":"1.0","type":"video","provider_name":"JW Player","provider_url":"https://www.jwplayer.com/","title":"Travis Scott - Made in America","description":"Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip!","upload_date":"2020-03-14T14:25:04.000Z","thumbnail_url":"https://assets-jpcust.jwpsrv.com/thumbs/Fpw44kH6-720.jpg","html":"<div style=\"padding-bottom:56.25%; position:relative;\"><iframe src=\"https://content.jwplatform.com/players/Fpw44kH6-IxzuqJ4M.html\" width=\"100%\" style=\"top:0; left:0; width:100%; height:100%; position:absolute; border:0;\" allowfullscreen scrolling=\"no\" allow=\"autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer\"></iframe></div>","width":480,"height":270,"embed_url":"https://content.jwplatform.com/players/Fpw44kH6-IxzuqJ4M.html","content_url":"https://content.jwplatform.com/videos/Fpw44kH6-outY7nml.mp4"})
})
