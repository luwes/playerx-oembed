export default {

  patterns: [
    /https?:\/\/(?:www\.)?vimeo\.com\/(?:video\/)?(\d+)/,
  ],

  name: 'Vimeo',

  options: 'width maxwidth height maxheight byline title\
    portrait color autoplay loop xhtml api wmode\
    iframe player_id',

  buildUrl(req) {
    let url = new URL('https://vimeo.com/api/oembed.json');
    url.searchParams.set('url', req.url);
    return url;
  },

  serialize() {
    const data = {
      head: [
        { type: 'link', rel: 'preconnect', href: 'https://player.vimeo.com' },
        { type: 'link', rel: 'preconnect', href: 'https://i.vimeocdn.com' },
        { type: 'link', rel: 'preconnect', href: 'https://f.vimeocdn.com' },
      ]
    };
    return data;
  }

};
