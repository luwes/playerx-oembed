// https://knowledge.vidyard.com/hc/en-us/articles/360010000393-Share-a-Vidyard-player-using-oEmbed
// https://knowledge.vidyard.com/hc/en-us/articles/360009879754-Use-query-strings-to-override-player-settings
import { vidyard as config, getHtml } from 'playerx/dist/config.js'
import { getFileHeaders } from '../utils.js'

const { name, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options:
    'name_overlay disable_ctas hide_playlist hidden_controls hide_html5_playlist\
    viral_sharing embed_button color playlist_color play_button_color preload\
    playlist_always_open playlist_start_open disable_redirect no_html5_fullscreen\
    custom_id muted autoplay chapter video_id second redirect_whole_page\
    redirect_url loop cc quality first_frame speed audio_track new_visitor\
    disable_analytics referring_url vyemail pardot_id hubspot_id vysfid\
    eloqua_contact_id eloqua_id marketo_id type uuid aspect v vydata',

  scrape: {
    thumbnail_url: {
      selector: 'meta[property="og:image"]',
      value: (element) => element.getAttribute('content'),
    },
    duration: {
      selector: 'meta[property="video:duration"]',
      value: (element) => Number(element.getAttribute('content')),
    },
    description: {
      selector: 'meta[name="description"]',
      value: (element) => element.getAttribute('content'),
    },
    embed_url: {
      selector: 'meta[name="twitter:player"]',
      value: (element) => element.getAttribute('content'),
    },
    content_url: {
      selector: 'meta[name="twitter:player:stream"]',
      value: (element) => element.getAttribute('content'),
    },
  },

  buildUrl(req) {
    let url = new URL('https://api.vidyard.com/dashboard/v1.1/oembed')
    url.searchParams.set('url', req.url)
    url.searchParams.set('format', 'json')
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
        options: JSON.stringify(
          Object.fromEntries(this.filterParams(this.options, req.searchParams)),
        ),
        params: this.filterParams(this.options, req.searchParams).toString(),
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
