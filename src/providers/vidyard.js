// https://knowledge.vidyard.com/hc/en-us/articles/360010000393-Share-a-Vidyard-player-using-oEmbed
import { getFileHeaders } from '../utils.js';

export default {

  patterns: [
    /https?:\/\/[^.]+\.vidyard\..*?\/(?:share|watch)\/(\w+)/,
  ],

  name: 'Vidyard',

  options: 'maxwidth maxheight',

  scrape: {
    thumbnail_url: {
      selector: 'meta[property="og:image"]',
      value: (element) => element.getAttribute('content')
    },
    duration: {
      selector: 'meta[property="video:duration"]',
      value: (element) => Number(element.getAttribute('content'))
    },
    description: {
      selector: 'meta[name="description"]',
      value: (element) => element.getAttribute('content')
    },
    embed_url: {
      selector: 'meta[name="twitter:player"]',
      value: (element) => element.getAttribute('content')
    },
    content_url: {
      selector: 'meta[name="twitter:player:stream"]',
      value: (element) => element.getAttribute('content')
    },
  },

  buildUrl(req) {
    let url = new URL('https://api.vidyard.com/dashboard/v1.1/oembed');
    url.searchParams.set('url', req.url);
    url.searchParams.set('format', 'json');
    return url;
  },

  async serialize(data) {
    const thumbHeaders = await getFileHeaders(data.thumbnail_url);

    return {
      ...data,
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
    };
  },

};
