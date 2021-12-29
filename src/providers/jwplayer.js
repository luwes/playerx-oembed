import { jwplayer, getHtml } from 'playerx/dist/config.js'
import { getMaxDimensions, jpegDimensions } from '../utils.js'

const { name, url, srcPattern } = jwplayer

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options: 'class id poster autoplay muted controls',

  oembed: {
    type: 'video',
    version: '1.0',
    provider_name: name,
    provider_url: url,
  },

  async serialize(data, req) {
    const jsonUrl = `https://cdn.jwplayer.com/v2/media/${req.captures[1]}`
    const json = await (await fetch(jsonUrl)).json()
    const item = json && json.playlist && json.playlist[0]
    if (item) {
      data.upload_date = new Date(item.pubdate * 1000).toISOString()
      data.title = item.title
      data.description = item.description
      data.thumbnail_url = item.image
      data.duration = item.duration
      Object.assign(data, getMaxDimensions(item.sources))
    }

    const rect = await jpegDimensions(data.thumbnail_url)

    return {
      ...data,
      thumbnail_width: rect.width,
      thumbnail_height: rect.height,
      html: getHtml({
        ...jwplayer,
        src: req.url,
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
