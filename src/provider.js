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

  serialize(body) {
    return body;
  },

  async finalize(req, data) {
    if (this.scrape) {
      Object.assign(data, await scraper(req.url, this.scrape));
    }
    return this.serialize(data);
  },

}
