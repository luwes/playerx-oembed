import { muxvideo as config, getHtml } from 'playerx/dist/config.js'
import { jpegDimensions } from '../utils.js'

const { name, url, srcPattern } = config

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
    const thumbnail_url = `https://image.mux.com/${req.captures[1]}/thumbnail.jpg`
    const rect = await jpegDimensions(thumbnail_url)

    return {
      ...data,
      thumbnail_url,
      thumbnail_width: rect.width,
      thumbnail_height: rect.height,
      width: rect.width,
      height: rect.height,
      html: getHtml({
        ...config,
        src: req.url,
        poster: thumbnail_url,
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
