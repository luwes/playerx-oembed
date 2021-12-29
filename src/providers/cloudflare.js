// https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player#basic-options
import { cloudflare as config, getHtml } from 'playerx/dist/config.js'
import { jpegDimensions, getFileHeaders } from '../utils.js'

const { name, url, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options:
    'class id autoplay controls defaultTextTrack loop muted preload\
    poster primaryColor startTime',

  oembed: {
    type: 'video',
    version: '1.0',
    provider_name: name,
    provider_url: url,
  },

  async serialize(data, req) {
    const thumbnail_url = `https://videodelivery.net/${req.captures[1]}/thumbnails/thumbnail.jpg`
    const rect = await jpegDimensions(thumbnail_url)
    const thumbHeaders = await getFileHeaders(thumbnail_url)

    return {
      ...data,
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
      thumbnail_url,
      thumbnail_width: rect.width,
      thumbnail_height: rect.height,
      width: rect.width,
      height: rect.height,
      html: getHtml({
        ...config,
        src: req.url,
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
