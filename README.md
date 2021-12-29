# 🎞 Playerx oEmbed

Uses the media platform's oEmbed API when possible and enriches the response with useful metadata / structured data from the content URL using [Cloudflare workers](https://developers.cloudflare.com/workers/).

## Quick Example

A consumer makes the following HTTP request:

- [`https://api.playerx.io/oembed?url=https%3A%2F%2Fwesleyluyten.wistia.com%2Fmedias%2Foifkgmxnkb`](https://api.playerx.io/oembed?url=https%3A%2F%2Fwesleyluyten.wistia.com%2Fmedias%2Foifkgmxnkb)

The provider then responds with an oEmbed response:

```json
{
  "version": "1.0",
  "type": "video",
  "provider_name": "Wistia, Inc.",
  "provider_url": "https://wistia.com",
  "title": "The World In HDR 4K",
  "duration": 115.434,
  "upload_date": "2021-11-21T23:27:19.000Z",
  "thumbnail_url": "https://embed-ssl.wistia.com/deliveries/e3479c070161f77ff5b379a17ee91c1f.jpg?image_crop_resized=960x540",
  "thumbnail_width": 960,
  "thumbnail_height": 540,
  "html": "<iframe src=\"https://fast.wistia.net/embed/iframe/oifkgmxnkb\" title=\"The World In HDR 4K Video\" allow=\"autoplay; fullscreen\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" class=\"wistia_embed\" name=\"wistia_embed\" msallowfullscreen width=\"960\" height=\"540\"></iframe>\n<script src=\"https://fast.wistia.net/assets/external/E-v1.js\" async></script>",
  "width": 960,
  "height": 540,
  "embed_url": "https://fast.wistia.net/embed/iframe/oifkgmxnkb",
  "player_color": "174bd2"
}
```

## Consumer Request

Requests sent to the API endpoint must be HTTP GET requests, with all arguments sent as query parameters. All arguments must be urlencoded (as per RFC 1738).

The following query parameters are defined as part of the oEmbed spec:

param       | description
----------- | -----------
url         | **Required.** The URL to retrieve embedding information for.
maxwidth    | The maximum width of the embedded resource.
maxheight   | The maximum height of the embedded resource.
seo         | If [`seo=1`](https://api.playerx.io/oembed?url=https%3A%2F%2Fvimeo.com%2F357274789&seo=1), structured data in [JSON-LD](https://json-ld.org/) format is appended to the `html` property. The structured data adds [SEO (Search engine optimization)](https://en.wikipedia.org/wiki/Search_engine_optimization) to the media's embed code.
fields      | Filter the response properties based on the `fields` param. Comma separated. For example [`fields=title,thumbnail_url,html`](https://api.playerx.io/oembed?url=https%3A%2F%2Fvimeo.com%2F357274789&fields=title,thumbnail_url,html)

These are the supported URL params in the Playerx oEmbed layer but many media platform's oEmbed API support additional URL params. For example Vimeo supports: `width`, `height`, `byline`, `title`, `portrait`, `color`, `autoplay`, `loop`, `player_id`, etc.

## Purge cached resource

```bash
curl -X POST "https://api.playerx.io/oembed?url=https%3A%2F%2Fvimeo.com%2F357274789" \
-H "X-Purge: 1"
```

## Supported Providers

Supported providers so far (feel free to open a PR):

- api.video [/oembed?url=embed.api.video/vod/vi7pA8Iz9m3S466XPu8qUJr](https://api.playerx.io/oembed?url=https%3A%2F%2Fembed.api.video%2Fvod%2Fvi7pA8Iz9m3S466XPu8qUJr)
- Brightcove [/oembed?url=players.brightcove.net/1752604059001/default_default/index.html?videoId=4883184247001](https://api.playerx.io/oembed?url=https%3A%2F%2Fplayers.brightcove.net%2F1752604059001%2Fdefault_default%2Findex.html%3FvideoId%3D4883184247001)
- Cloudflare [/oembed?url=watch.videodelivery.net/57dbd37a90f3259b33ab5fe6f4c88e38](https://api.playerx.io/oembed?url=https%3A%2F%2Fwatch.videodelivery.net%2F57dbd37a90f3259b33ab5fe6f4c88e38)
- Cloudinary [/oembed?url=res.cloudinary.com/dkbu77yte/video/upload/sp_4k/v1640704833/the_world_in_4k_hdr.m3u8](https://api.playerx.io/oembed?url=https%3A%2F%2Fres.cloudinary.com%2Fdkbu77yte%2Fvideo%2Fupload%2Fsp_4k%2Fv1640704833%2Fthe_world_in_4k_hdr.m3u8)
- Dailymotion [/oembed?url=www.dailymotion.com/video/x85qs0t](https://api.playerx.io/oembed?url=https://www.dailymotion.com/video/x85qs0t)
- Facebook [/oembed?url=www.facebook.com/wesleyluyten/videos/780960923305550](https://api.playerx.io/oembed?url=https://www.facebook.com/wesleyluyten/videos/780960923305550)
- JW Player [/oembed?url=cdn.jwplayer.com/players/V073end4-Pd4r8gwe.html](https://api.playerx.io/oembed?url=https://cdn.jwplayer.com/players/V073end4-Pd4r8gwe.html)
- MUX video [/oembed?url=stream.mux.com/r4rOE02cc95tbe3I00302nlrHfT023Q3IedFJW029w018KxZA.m3u8](https://api.playerx.io/oembed?url=https%3A%2F%2Fstream.mux.com%2Fr4rOE02cc95tbe3I00302nlrHfT023Q3IedFJW029w018KxZA.m3u8)
- Streamable [/oembed?url=streamable.com/pz0lmz](https://api.playerx.io/oembed?url=https://streamable.com/pz0lmz)
- Vidyard [/oembed?url=share.vidyard.com/watch/SpdS7bytPcF1Ztc8d7NxHC?](https://api.playerx.io/oembed?url=https://share.vidyard.com/watch/SpdS7bytPcF1Ztc8d7NxHC?)
- Vimeo [/oembed?url=vimeo.com/648359100](https://api.playerx.io/oembed?url=https://vimeo.com/648359100)
- Wistia [/oembed?url=wesleyluyten.wistia.com/medias/oifkgmxnkb](https://api.playerx.io/oembed?url=https%3A%2F%2Fwesleyluyten.wistia.com%2Fmedias%2Foifkgmxnkb)
- YouTube [/oembed?url=www.youtube.com/watch?v=uxsOYVWclA0](https://api.playerx.io/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DuxsOYVWclA0)

## Used by

- [`<plx-schema>`](https://dev.playerx.io/docs/schema/) Add SEO to your media embeds
- [`<plx-preview>`](https://dev.playerx.io/docs/preview/) Load lightweight previews before your media players

## Thanks

- [Cloudflare](https://www.cloudflare.com/) for the generous free tier
- [noembed](https://github.com/leedo/noembed/) for the initial code structure
