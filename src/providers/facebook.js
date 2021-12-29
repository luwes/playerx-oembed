/* global IFRAMELY_API_KEY */
import { facebook as config, getHtml } from 'playerx/dist/config.js'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options: 'api_key autoplay allowfullscreen lazy show-text show-captions',

  buildUrl(req) {
    // FB removed their public oEmbed API :/
    let url = new URL('https://iframe.ly/api/iframely')
    url.searchParams.set('url', req.url)
    // This is a Iframely dev license limited to 1000 unique hits per month!
    url.searchParams.set('api_key', IFRAMELY_API_KEY)
    return url
  },

  serialize(data, req) {
    const { meta, links: { thumbnail } } = data
    const { title, description, author, author_url, duration, date } = meta

    return {
      type: 'video',
      version: '1.0',
      provider_name: 'Facebook',
      provider_url: 'https://www.facebook.com/',
      title,
      description,
      author_name: author,
      author_url,
      duration,
      upload_date: date,
      thumbnail_url: thumbnail && thumbnail[0].href,
      thumbnail_width: thumbnail && thumbnail[0].media.width,
      thumbnail_height: thumbnail && thumbnail[0].media.height,
      html: getHtml({
        ...config,
        src: req.url,
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
