import { cloudflare, getHtml } from 'playerx/dist/config.js'
import { jpegDimensions } from '../utils.js'

const { name, url, srcPattern } = cloudflare

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
    const thumbnail_url = `https://videodelivery.net/${req.captures[1]}/thumbnails/thumbnail.jpg`
    const rect = await jpegDimensions(thumbnail_url)

    return {
      ...data,
      thumbnail_url,
      thumbnail_width: rect.width,
      thumbnail_height: rect.height,
      width: rect.width,
      height: rect.height,
      html: getHtml({
        ...cloudflare,
        src: req.url,
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
