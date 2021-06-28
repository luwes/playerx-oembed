export default {

  name: null,
  options: 'maxwidth maxheight',

  buildUrl(req) {
    let url = new URL(`https://${this.name.toLowerCase()}.com/oembed`);
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

  finalize(req, data) {
    return {
      ...data,
      ...this.serialize(data)
    };
  },

}
