import { createRequest } from './request.js'
import * as providers from './providers/index.js'
import Provider from './provider.js'
import { scrapeHTML } from './scrape.js'

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event))
})

/**
 * Respond with enriched oEmbed response.
 * @param {FetchEvent} event
 */
async function handleRequest(event) {
  const request = event.request
  if (request.method !== 'GET' && request.method !== 'POST') {
    return MethodNotAllowed(request)
  }

  const req = createRequest(request)
  if (!req.url) {
    const body = 'url parameter is required'
    return new Response(body, { status: 400 })
  }

  const composedProviders = Object.keys(providers).map((p) => ({
    ...Provider,
    ...providers[p],
  }))

  const provider = findProvider(composedProviders, req)
  if (!provider) return NotFound()

  // e.g. https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F357274789&maxwidth=1080
  const oEmbedUrl = provider.requestUrl(req)
  // e.g. https://vimeo.com/357274789
  const contentUrl = oEmbedUrl.searchParams.get('url')

  if (request.method === 'POST') {
    return handlePost(event, String(oEmbedUrl), contentUrl)
  }

  const cache = caches.default
  let response = await cache.match(String(oEmbedUrl))
  if (response) {
    console.warn(`cache hit for ${oEmbedUrl}`)
    return response
  }

  let data = provider.oembed || (await (await fetch(oEmbedUrl)).json())

  if (provider.scrape) {
    const html = await fetch(contentUrl)
    data = { ...data, ...(await scrapeHTML(html, provider.scrape)) }
  }

  const json = await provider.finalize(req, data)

  response = new Response(JSON.stringify(json), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `s-maxage=${60 * 60 * 24 * 100}`,
    },
  })

  event.waitUntil(cache.put(String(oEmbedUrl), response.clone()))

  return response
}

/**
 * Purge caches with POST.
 * @param {FetchEvent} event
 * @param {string} oEmbedUrl
 */
async function handlePost(event, oEmbedUrl) {
  const request = event.request

  if (String(request.headers.get('x-purge')) === '1') {
    const cache = caches.default
    return new Response(
      JSON.stringify({
        [oEmbedUrl]: await cache.delete(oEmbedUrl),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }

  const body = 'x-purge header is required'
  return new Response(body, { status: 400 })
}

function MethodNotAllowed(request) {
  return new Response(`Method ${request.method} not allowed.`, {
    status: 405,
    headers: {
      Allow: 'GET',
    },
  })
}

function NotFound() {
  return new Response(`Not Found`, {
    status: 404,
  })
}

function findProvider(composedProviders, req) {
  return composedProviders.find((p) => p.matches(req))
}
