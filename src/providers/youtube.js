import { youtube as config, getHtml } from 'playerx/dist/config.js'
import { parse, toSeconds } from 'iso8601-duration'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options:
    'enablejsapi autoplay controls cc_lang_pref cc_load_policy color disablekb\
    end fs hl iv_load_policy loop modestbranding origin playlist playsinline\
    rel start widget_referrer',

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

  serialize(data, req) {
    return {
      ...data,
      html: getHtml({
        ...config,
        src: req.url,
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
