import { parse, toSeconds } from 'iso8601-duration'

export default {
  patterns: [
    /https?:\/\/(?:[^.]+\.)?youtube\.com\/watch\/?\?(?:.+&)?v=([^&]+)/,
    /https?:\/\/(?:[^.]+\.)?(?:youtu\.be|youtube\.com\/embed)\/([a-zA-Z0-9_-]+)/,
  ],

  name: 'YouTube',

  options: 'maxwidth maxheight autoplay',

  scrape: {
    duration: {
      selector: 'meta[itemprop="duration"]',
      value: (element) => toSeconds(parse(element.getAttribute('content'))),
    },
    upload_date: {
      selector: 'meta[itemprop="uploadDate"]',
      value: (element) =>
        new Date(element.getAttribute('content')).toISOString(),
    },
    description: {
      selector: 'meta[itemprop="description"]',
      value: (element) => element.getAttribute('content'),
    },
  },

  buildUrl(req) {
    let url = new URL('https://www.youtube.com/oembed/')
    let id = req.captures[1]
    url.searchParams.set('url', `https://www.youtube.com/watch?v=${id}`)
    return url
  },

  serialize(data) {
    return {
      ...data,
    }
  },
}
