import { getFileHeaders } from '../utils.js';

export default {

  patterns: [
    /https?:\/\/(?:cdn\.)?jwplayer\.com\/players\/(\w+)(?:-(\w+))?/,
  ],

  name: 'JW Player',

  options: '',

  oembed: {
    type: 'video',
    version: '1.0',
    provider_name: 'JW Player',
    provider_url: 'https://www.jwplayer.com/',
  },

  scrape: {
    title: {
      selector: 'meta[property="og:title"]',
      value: (element) => element.getAttribute('content')
    },
    description: {
      selector: 'meta[property="og:description"]',
      value: (element) => element.getAttribute('content')
    },
    thumbnail_url: {
      selector: 'meta[property="og:image"]',
      value: (element) => element.getAttribute('content')
    },
    content_url: {
      selector: 'meta[property="og:video"]',
      value: (element) => element.getAttribute('content')
    },
    width: {
      selector: 'meta[property="og:video:width"]',
      value: (element) => Number(element.getAttribute('content'))
    },
    height: {
      selector: 'meta[property="og:video:height"]',
      value: (element) => Number(element.getAttribute('content'))
    },
    embed_url: {
      selector: 'meta[name="twitter:player"]',
      value: (element) => element.getAttribute('content')
    },
  },

  async serialize(data) {
    const thumbHeaders = await getFileHeaders(data.thumbnail_url);

    return {
      ...data,
      upload_date: new Date(thumbHeaders['last-modified']).toISOString(),
      html: `<div style="padding-bottom:${data.height / data.width * 100}%; position:relative;"><iframe src="${data.embed_url}" width="100%" style="top:0; left:0; width:100%; height:100%; position:absolute; border:0;" allowfullscreen scrolling="no" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"></iframe></div>`
    };
  },

};

