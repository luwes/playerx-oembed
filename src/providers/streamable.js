import { getFileHeaders } from '../utils.js'

export default {
  patterns: [/https?:\/\/(?:www\.)?streamable\.com\/(\w+)$/],

  name: 'Streamable',

  options: 'maxwidth maxheight',

  scrape: {
    duration: {
      selector: 'script[data-duration]',
      value: (element) => Number(element.getAttribute('data-duration')),
    },
    embed_url: {
      selector: 'meta[name="twitter:player"]',
      value: (element) => element.getAttribute('content'),
    },
    content_url: {
      selector: 'meta[property="og:video:url"]',
      value: (element) => element.getAttribute('content'),
    },
  },

  buildUrl(req) {
    let url = new URL('https://api.streamable.com/oembed.json')
    url.searchParams.set('url', req.url)
    return url
  },

  async serialize(data) {
    if (data.thumbnail_url.startsWith('//')) {
      data.thumbnail_url = `https:${data.thumbnail_url}`
    }

    const thumbHeaders = await getFileHeaders(data.thumbnail_url)

    return {
      ...data,
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
    }
  },
}
