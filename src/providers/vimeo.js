import { vimeo as config, getHtml } from 'playerx/dist/config.js'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options:
    'autopause autoplay background byline color controls dnt keyboard loop\
    muted pip playsinline portrait quality speed texttrack title transparent',

  buildUrl(req) {
    let url = new URL('https://vimeo.com/api/oembed.json')
    url.searchParams.set('url', req.url)
    return url
  },

  serialize(data, req) {
    const date = new Date(data.upload_date)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return {
      ...data,
      upload_date: date.toISOString(),
      html: getHtml({
        ...config,
        src: req.url,
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
