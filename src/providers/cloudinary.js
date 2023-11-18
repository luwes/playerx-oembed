import { cloudinary as config, getHtml } from 'playerx/config'
import { jpegDimensions } from '../utils.js'

const { name, url, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options: 'class id autoplay muted controls loop preload playsinline',

  oembed: {
    type: 'video',
    version: '1.0',
    provider_name: name,
    provider_url: url,
  },

  async serialize(data, req) {
    const thumbnail_url = `https://res.cloudinary.com/${req.captures[1]}/video/upload/c_limit,h_400,w_800/${req.captures[3]}.jpg`
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
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
