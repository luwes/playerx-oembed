import { secondsToISOString } from './utils.js';

export default {
  name: null,
  options: 'maxwidth maxheight',

  buildUrl(req) {
    let providerName = this.name.toLowerCase().replace(/\s/g, '')
    let url = new URL(`https://${providerName}.com/oembed`)
    url.searchParams.set('url', req.url)
    url.searchParams.set('format', 'json')
    return url
  },

  requestUrl(req) {
    let url = this.buildUrl(req)
    let params = req.searchParams

    ;(this.options.match(/\S+/g) || []).forEach((option) => {
      if (params.has(option)) {
        url.searchParams.set(option, params.get(option))
      }
    })

    return url
  },

  matches(req) {
    return this.patterns.some((pattern) => {
      if (pattern.test(req.url)) {
        req.pattern = pattern
        return true
      }
      return false
    })
  },

  async finalize(req, data) {
    data = this.sortJson(await this.serialize(data))

    let params = req.searchParams
    for (let key of ['seo']) {
      if (params.get(key) == '1' || params.get(key) == 'true') {
        data = this[key](data)
      }
    }

    return data
  },

  seo(data) {
    const json = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data.title,
      description: data.description,
      uploadDate: data.upload_date && new Date(data.upload_date).toISOString(),
      duration: data.duration && secondsToISOString(data.duration),
      embedUrl: ((data.html || '').match(/<iframe[^>]+src="([^"]+)/) || [])[1]
    }

    Object.keys(json).forEach((prop) => {
      if (json[prop] == null) {
        delete json[prop]
      }
    })

    return {
      ...data,
      html: `${data.html}<script type="application/ld+json">${JSON.stringify(json)}</script>`
    }
  },

  serialize(body) {
    return body
  },

  sortJson(data) {
    return Object.assign(
      {
        version: undefined,
        type: undefined,
        provider_name: undefined,
        provider_url: undefined,
        cache_age: undefined,
        title: undefined,
        description: undefined, // schema ext
        duration: undefined, // schema ext
        upload_date: undefined, // schema ext
        author_name: undefined,
        author_url: undefined,
        thumbnail_url: undefined,
        thumbnail_width: undefined,
        thumbnail_height: undefined,
        html: undefined,
        width: undefined,
        height: undefined,
        embed_url: undefined, // schema ext
        content_url: undefined, // schema ext
      },
      data,
    )
  },
}
