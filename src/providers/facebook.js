/* global IFRAMELY_API_KEY */
export default {
  patterns: [
    /https?:\/\/(?:www\.|m\.)?facebook\.com\/.*videos\/(\d+)/,
    /https?:\/\/(?:www\.|m\.)?facebook\.com\/video\.php\?(id|v)=(\d+)/,
  ],

  name: 'Facebook',

  options: 'api_key',

  buildUrl(req) {
    // FB removed their public oEmbed API :/
    let url = new URL('https://iframe.ly/api/iframely')
    url.searchParams.set('url', req.url)
    // This is a Iframely dev license limited to 1000 unique hits per month!
    url.searchParams.set('api_key', IFRAMELY_API_KEY)
    return url
  },

  serialize(data, req) {
    const { meta, links: { player, thumbnail } } = data
    const { title, description, author, author_url, duration, date } = meta

    return {
      type: 'video',
      version: '1.0',
      provider_name: 'Facebook',
      provider_url: 'https://www.facebook.com/',
      title,
      description,
      author_name: author,
      author_url,
      duration,
      upload_date: date,
      thumbnail_url: thumbnail && thumbnail[0].href,
      thumbnail_width: thumbnail && thumbnail[0].media.width,
      thumbnail_height: thumbnail && thumbnail[0].media.height,
      html: player[0].html,
      embed_url: `https://www.facebook.com/v3.2/plugins/video.php?allowfullscreen=true&href=${encodeURIComponent(req.url)}`
    }
  },
}
