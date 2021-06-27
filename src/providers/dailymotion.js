export default {

  patterns: [
    /https?:\/\/(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/(\w+)$/,
  ],

  name: 'Dailymotion',

  options: 'maxwidth maxheight autoplay',

  scrape: {
    duration: {
      selector: 'meta[property="video:duration"]',
      value: (element) => Number(element.getAttribute('content'))
    },
    upload_date: {
      selector: 'meta[property="video:release_date"]',
      value: (element) => new Date(element.getAttribute('content')).toISOString()
    },
  },

  buildUrl(req) {
    let url = new URL('https://www.dailymotion.com/services/oembed');
    url.searchParams.set('url', req.url);
    return url;
  },

};
