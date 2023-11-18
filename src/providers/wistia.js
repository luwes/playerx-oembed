// https://wistia.com/support/developers/embed-options#options
import { wistia as config, getHtml } from 'playerx/config'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options:
    'autoPlay controlsVisibleOnLoad copyLinkAndThumbnailEnabled doNotTrack\
    email endVideoBehavior fakeFullscreen fitStrategy fullscreenButton\
    fullscreenOnRotateToLandscape googleAnalytics muted playbackRateControl\
    playbar playButton playerColor playlistLinks playlistLoop playsinline\
    playPauseNotifier playSuspendedOffScreen plugin preload qualityControl\
    qualityMax qualityMin resumable seo settingsControl silentAutoPlay\
    smallPlayButton stillUrl time thumbnailAltText videoFoam volume volumeControl',

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

  serialize(data, req) {
    return {
      ...data,
      embed_url: undefined, // inline embed is preferred
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
