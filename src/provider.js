import { scraper } from './scraper.js';

export default {

  name: null,
  options: 'maxwidth maxheight',

  buildUrl(req) {
    let providerName = this.name.toLowerCase().replace(/\s/g, '');
    let url = new URL(`https://${providerName}.com/oembed`);
    url.searchParams.set('url', req.url);
    url.searchParams.set('format', 'json');
    return url;
  },

  requestUrl(req) {
    let url = this.buildUrl(req);
    let params = req.searchParams;

    (this.options.match(/\S+/g) || []).forEach(option => {
      if (params.has(option)) {
        url.searchParams.set(option, params.get(option));
      }
    });

    return url;
  },

  matches(req) {
    return this.patterns.some(pattern => {
      if (pattern.test(req.url)) {
        req.pattern = pattern;
        return true;
      }
      return false;
    });
  },

  async finalize(req, data) {
    if (this.scrape) {
      Object.assign(data, await scraper(req.url, this.scrape));
    }
    return this.sortJson(await this.serialize(data));
  },

  serialize(body) {
    return body;
  },

  sortJson(data) {
    return Object.assign({
      version: undefined,
      type: undefined,
      provider_name: undefined,
      provider_url: undefined,
      cache_age: undefined,
      title: undefined,
      description: undefined,      // schema ext
      duration: undefined,         // schema ext
      upload_date: undefined,      // schema ext
      author_name: undefined,
      author_url: undefined,
      thumbnail_url: undefined,
      thumbnail_width: undefined,
      thumbnail_height: undefined,
      html: undefined,
      width: undefined,
      height: undefined,
      embed_url: undefined,        // schema ext
      content_url: undefined,      // schema ext
    }, data);
  }

}
