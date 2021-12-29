// https://developer.dailymotion.com/player/#player-runtime-parameters
import { dailymotion as config, getHtml } from 'playerx/dist/config.js'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options:
    'autoplay muted loop controls origin quality sharing-enable start\
    subtitles-default syndication ui-highlight ui-logo ui-start-screen-info\
    fullscreen scaleMode queue-enable',

  scrape: {
    duration: {
      selector: 'meta[property="video:duration"]',
      value: (element) => Number(element.getAttribute('content')),
    },
    upload_date: {
      selector: 'meta[property="video:release_date"]',
      value: (element) =>
        new Date(element.getAttribute('content')).toISOString(),
    },
  },

  buildUrl(req) {
    let url = new URL('https://www.dailymotion.com/services/oembed')
    url.searchParams.set('url', req.url)
    return url
  },

  serialize(data, req) {
    return {
      ...data,
      html: getHtml({
        ...config,
        src: req.url,
        options: JSON.stringify(
          Object.fromEntries(this.filterParams(this.options, req.searchParams)),
        ),
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
