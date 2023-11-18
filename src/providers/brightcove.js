import { brightcove as config, getHtml } from 'playerx/config'
import { getMaxDimensions, jpegDimensions } from '../utils.js'

const { name, url, srcPattern } = config

export default {
  patterns: [new RegExp(srcPattern)],

  name,

  options: 'class id autoplay muted controls loop preload playsinline',

  oembed: {
    type: 'video',
    version: '1.0',
    provider_name: name,
    provider_url: url,
  },

  async serialize(data, req) {
    const jsUrl = `https://players.brightcove.net/${req.captures[1]}/default_default/index.min.js`
    const js = await (await fetch(jsUrl)).text()
    const matches = js.match(/policyKey:"([^"]+)/)
    const pk = matches && matches[1]
    if (pk) {
      const jsonUrl = `https://edge.api.brightcove.com/playback/v1/accounts/${req.captures[1]}/videos/${req.captures[4]}`
      const init = {
        headers: {
          accept: `application/json;pk=${pk}`,
        },
      }
      const json = await (await fetch(jsonUrl, init)).json()
      if (json.name) data.title = json.name
      if (json.description) data.description = json.description
      data.duration = json.duration / 1000
      data.thumbnail_url = json.poster
      data.upload_date = json.created_at
      Object.assign(data, getMaxDimensions(json.sources))
    }

    const rect = await jpegDimensions(data.thumbnail_url)

    return {
      ...data,
      thumbnail_width: rect.width,
      thumbnail_height: rect.height,
      html: getHtml({
        ...config,
        src: req.url,
        ...Object.fromEntries(req.searchParams),
      }),
    }
  },
}
