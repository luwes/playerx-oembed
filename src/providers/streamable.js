export default {
  patterns: [/https?:\/\/(?:www\.)?streamable\.com\/(\w+)$/],

  name: 'Streamable',

  options: 'maxwidth maxheight',

  scrape: {
    duration: {
      selector: 'script[data-duration]',
      value: (element) => Number(element.getAttribute('data-duration')),
    },
    upload_date: {
      selector: 'meta[property="og:updated_time"]',
      value: (element) => {
        const date = new Date(element.getAttribute('content'))
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return date.toISOString()
      },
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
}
