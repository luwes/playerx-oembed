/* globals HTMLRewriter */
import * as providers from './providers/index.js'
import Provider from './provider.js'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with enriched oEmbed response.
 * @param {Request} request
 */
async function handleRequest(request) {
  const req = createRequest(request)
  if (!req.url) {
    const body = 'url parameter is required'
    return new Response(body, { status: 400 })
  }

  const composedProviders = Object.keys(providers).map((p) =>
    Object.assign({}, Provider, providers[p]),
  )

  const provider = findProvider(composedProviders, req)
  const url = provider.requestUrl(req)
  const data = provider.oembed || (await (await fetch(url)).json())

  if (provider.scrape) {
    const contentUrl = url.searchParams.get('url')
    Object.assign(data, await scraper(contentUrl, provider.scrape))
  }

  const json = provider.finalize(req, data)

  return new Response(JSON.stringify(json), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function findProvider(composedProviders, req) {
  return composedProviders.find((p) => p.matches(req))
}

/**
 * Create a new request info object.
 * @param  {Request} request
 * @return {Object}
 */
function createRequest(request) {
  const url = new URL(request.url)

  return {
    url: url.searchParams.get('url'),
    searchParams: url.searchParams,
    pattern: null, // set in provider.matches
    get captures() {
      return this.url.match(this.pattern) || []
    },
  }
}

async function scraper(contentUrl, scrape) {
  console.log(contentUrl);
  const oldResponse = await fetch(contentUrl)

  const rewriter = new HTMLRewriter()
  const data = {}

  for (const prop in scrape) {
    const { selector, value } = scrape[prop]

    let handler = {}
    let nextText = ''

    if (/^script\[/.test(selector)) {
      handler = {
        element() {
          nextText = ''
        },
        text(text) {
          nextText += text.text

          if (text.lastInTextNode) {
            Object.assign(data, value(nextText))
            nextText = ''
          }
        },
      }
    } else {
      handler = {
        element(element) {
          data[prop] = value(element)
        },
      }
    }

    rewriter.on(selector, handler)
  }

  await rewriter.transform(oldResponse).arrayBuffer()

  return data
}