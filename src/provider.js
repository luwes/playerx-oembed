import { secondsToISOString } from './utils.js';

const providerOptions = 'seo fields callback api'

export default {
  name: null,
  options: '',

  cacheParams(req) {
    let options = `url maxwidth maxheight width height ${providerOptions} ${this.options}`
    return this.filterParams(options, req.searchParams)
  },

  requestUrl(req) {
    let url = this.buildUrl(req)
    let options = `maxwidth maxheight width height ${this.options}`
    let params = this.filterParams(options, req.searchParams)
    params.forEach((value, key) => url.searchParams.set(key, value))
    return url
  },

  buildUrl(req) {
    let providerName = this.name.toLowerCase().replace(/\s/g, '')
    let url = new URL(`https://${providerName}.com/oembed`)
    url.searchParams.set('url', req.url)
    url.searchParams.set('format', 'json')
    return url
  },

  filterParams(options, params) {
    let requestParams = new URLSearchParams()
    ;(options.match(/\S+/g) || []).forEach((option) => {
      if (params.has(option)) {
        requestParams.set(option, params.get(option))
      }
    })
    return requestParams
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
    data = await this.serialize(data, req)

    let params = req.searchParams
    for (let key of providerOptions.match(/\S+/g)) {
      if (params.get(key) && typeof this[key] === 'function') {
        data = this[key](params.get(key), data)
      }
    }

    if (!data.embed_url && data.html) {
      const embedUrlMatches = data.html.match(/<iframe[^>]+src="([^"]+)/i)
      if (embedUrlMatches && embedUrlMatches[1]) {
        data.embed_url = embedUrlMatches[1];
      }
    }

    return this.sortJson(data)
  },

  seo(param, data) {
    if (param != '1') return data;

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

  fields(param, data) {
    const fields = param.split(',')
    return fields.reduce((acc, field) => {
      if (field in data) {
        acc[field] = data[field]
      }
      return acc
    }, {})
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
