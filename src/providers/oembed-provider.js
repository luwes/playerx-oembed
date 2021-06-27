export default {

  name: null,
  oEmbedUrl: null,
  options: 'maxwidth maxheight',

  buildUrl(req) {
    let url = new URL(this.oEmbedUrl);
    url.searchParams.set('url', req.url);
    url.searchParams.set('format', 'json');
    return url;
  },

  serialize(data) {
    return data;
  }

};
