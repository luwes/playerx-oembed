/* global FB_ACCESS_TOKEN */
export default {

  patterns: [
    /https?:\/\/(?:www\.)?facebook\.com\/.*videos\/(\d+)/,
    /https?:\/\/(?:www\.)?facebook\.com\/video\.php\?(id|v)=(\d+)/,
  ],

  name: 'Facebook',

  options: 'maxwidth omitscript',

  buildUrl(req) {
    let url = new URL('https://graph.facebook.com/v11.0/oembed_video');
    url.searchParams.set('url', req.url);
    url.searchParams.set('access_token', FB_ACCESS_TOKEN);
    return url;
  },

};
