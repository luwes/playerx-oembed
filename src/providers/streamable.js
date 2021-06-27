export default {

  patterns: [
    /https?:\/\/(?:www\.)?streamable\.com\/(\w+)$/,
  ],

  name: 'Streamable',

  options: 'maxwidth maxheight',

  buildUrl(req) {
    let url = new URL('https://api.streamable.com/oembed.json');
    url.searchParams.set('url', req.url);
    return url;
  },

};
