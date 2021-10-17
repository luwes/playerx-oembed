# 🙅‍♂️ oEmbed

Uses the media platform's oEmbed API when possible and enriches the response with useful metadata / structured data from the content URL using [Cloudflare workers](https://developers.cloudflare.com/workers/).

## Quick Example

A consumer makes the following HTTP request:

- [`https://api.playerx.io/oembed?url=https%3A%2F%2Fwesleyluyten.wistia.com%2Fmedias%2Fdgzftn5ctz`](https://api.playerx.io/oembed?url=https%3A%2F%2Fwesleyluyten.wistia.com%2Fmedias%2Fdgzftn5ctz)

The provider then responds with an oEmbed response:

```json
{
    "version": "1.0",
    "type": "video",
    "provider_name": "Wistia, Inc.",
    "provider_url": "https://wistia.com",
    "title": "Travis Scott - Made in America",
    "description": "Was dreaming about butterflies during the week got this in the weekend in Philadelphia on a random city trip! ",
    "duration": 46.067,
    "upload_date": "2020-02-26T21:05:05.000Z",
    "thumbnail_url": "https://embed-ssl.wistia.com/deliveries/3d454cc2f883b038ef9fd6d4a9917710.jpg?image_crop_resized=960x540",
    "thumbnail_width": 960,
    "thumbnail_height": 540,
    "html": "<iframe src=\"https://fast.wistia.net/embed/iframe/dgzftn5ctz\" title=\"Travis Scott - Made in America Video\" allow=\"autoplay; fullscreen\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" class=\"wistia_embed\" name=\"wistia_embed\" allowfullscreen msallowfullscreen width=\"960\" height=\"540\"></iframe>\n<script src=\"https://fast.wistia.net/assets/external/E-v1.js\" async></script>",
    "width": 960,
    "height": 540,
    "embed_url": "https://fast.wistia.net/embed/iframe/dgzftn5ctz",
    "player_color": "1e71e7"
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

- Vimeo (https://api.playerx.io/oembed?url=https%3A%2F%2Fvimeo.com%2F357274789)
- YouTube (https://api.playerx.io/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DBK1JIjLPwaA)
- Dailymotion (https://api.playerx.io/oembed?url=https%3A%2F%2Fwww.dailymotion.com%2Fvideo%2Fx7sgamf)
- Wistia (https://api.playerx.io/oembed?url=https%3A%2F%2Fwesleyluyten.wistia.com%2Fmedias%2Fdgzftn5ctz)
- Vidyard (https://api.playerx.io/oembed?url=https%3A%2F%2Fshare.vidyard.com%2Fwatch%2FTYY9iSji3mJuFqp2oj4FoL)
- Streamable (https://api.playerx.io/oembed?url=https%3A%2F%2Fstreamable.com%2Faizxh)
- Facebook (https://api.playerx.io/oembed?url=https%3A%2F%2Fwww.facebook.com%2Fwesleyluyten%2Fvideos%2F10220940465559072)
- JW Player (https://api.playerx.io/oembed?url=https%3A%2F%2Fcdn.jwplayer.com%2Fplayers%2FFpw44kH6-IxzuqJ4M.html)

## Thanks

- [Cloudflare](https://www.cloudflare.com/) for the generous free tier
- [noembed](https://github.com/leedo/noembed/) for the initial code structure
