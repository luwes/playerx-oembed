export default {
  patterns: [/https?:\/\/[^.]+\.(wistia\.com|wi\.st)\/.*/],

  name: 'Wistia',

  options: 'embedType handle popoverHeight popoverWidth',

  scrape: {
    upload_date: {
      selector: 'meta[itemprop="uploadDate"]',
      value: (element) =>
        new Date(element.getAttribute('content')).toISOString(),
    },
    description: {
      selector: 'meta[property="og:description"]',
      value: (element) => element.getAttribute('content'),
    },
    embed_url: {
      selector: 'meta[itemprop="embedUrl"]',
      value: (element) => element.getAttribute('content'),
    },
  },

  buildUrl(req) {
    let url = new URL('http://fast.wistia.com/oembed')
    url.searchParams.set('url', req.url)
    return url
  },
}
