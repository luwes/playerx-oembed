import { streamable as config, getHtml } from 'playerx/config'
import { getFileHeaders } from '../utils.js'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options: 'class id autoplay muted loop nocontrols hd',

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

  async serialize(data, req) {
    if (data.thumbnail_url.startsWith('//')) {
      data.thumbnail_url = `https:${data.thumbnail_url}`
    }

    const thumbHeaders = await getFileHeaders(data.thumbnail_url)

    return {
      ...data,
      embed_url: null, // retrieve it from the html property, not from oembed.
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
      html: getHtml({
        ...config,
        src: req.url,
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
