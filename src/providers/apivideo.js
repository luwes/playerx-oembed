import { getFileHeaders } from '../utils.js'

export default {
  patterns: [
    /api\.video\/(?:videos|vod)\/(\w+)/,
  ],

  name: 'api.video',

  options: 'maxwidth maxheight',

  scrape: {
    description: {
      selector: 'meta[property="og:description"]',
      value: (element) => element.getAttribute('content'),
    },
    content_url: {
      selector: 'meta[property="og:video"]',
      value: (element) => element.getAttribute('content'),
    },
    embed_url: {
      selector: 'meta[property="og:url"]',
      value: (element) => element.getAttribute('content'),
    },
  },

  buildUrl(req) {
    let url = new URL('https://oembed.api.video/')
    let id = req.captures[1]
    url.searchParams.set('url', `https://embed.api.video/vod/${id}`)
    return url
  },

  async serialize(data) {
    const thumbHeaders = await getFileHeaders(data.thumbnail_url)

    return {
      ...data,
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
    }
  },
}
