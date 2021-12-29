import { apivideo as config, getHtml } from 'playerx/dist/config.js'
import { getFileHeaders } from '../utils.js'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options: 'autoplay loop t api hide-title hide-controls show-subtitles dl',

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

  async serialize(data, req) {
    const thumbHeaders = await getFileHeaders(data.thumbnail_url)

    return {
      ...data,
      embed_url: null, // retrieve it from the html property, not from oembed.
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
      html: getHtml({
        ...config,
        src: req.url,
        params: serializeParams(
          Object.fromEntries(this.filterParams(this.options, req.searchParams)),
        ),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}

/**
 * @see https://docs.api.video/docs/video-playback-features
 * @param  {Object} props
 * @return {string} e.g. autoplay;loop
 */
function serializeParams(props) {
  return Object.keys(props)
    .map((key) => {
      if ([true, '1', 'true'].includes(props[key])) return key
      if ([false, '0', 'false'].includes(props[key])) return ''
      return `${key}=${props[key]}`
    })
    .join(';')
}
