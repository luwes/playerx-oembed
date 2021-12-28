/* global CF_ZONE, CF_TOKEN */
import { createRequest } from './request.js'
import * as providers from './providers/index.js'
import Provider from './provider.js'
import { scrapeHTML } from './scrape.js'
import { render } from './render.js'

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

  const url = new URL(request.url)
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
  // searchParams are sorted and matched for each provider
  const cacheUrl = `${url.origin}${url.pathname}?${provider.cacheParams(req)}`;

  if (request.method === 'POST') {
    return handlePost(event, cacheUrl, contentUrl)
  }

  const cache = caches.default
  let response = await cache.match(cacheUrl)
  if (response) {
    console.warn(`cache hit for ${cacheUrl}`)
  } else {
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

    event.waitUntil(cache.put(cacheUrl, response.clone()))
  }

  if (url.pathname === '/html') {
    return new Response((await response.clone().json()).html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    })
  }

  if (url.pathname === '/render') {
    return render(event, await response.clone().json())
  }

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

    const url = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE}/purge_cache`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CF_TOKEN}`,
      },
      body: JSON.stringify({
        files: [oEmbedUrl]
      })
    });

    return new Response(
      JSON.stringify(await response.json()),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }

  const body = 'x-purge header is required'
  return new Response(body, {
    status: 400,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function MethodNotAllowed(request) {
  return new Response(`Method ${request.method} not allowed.`, {
    status: 405,
    headers: {
      Allow: 'GET',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function NotFound() {
  return new Response(`Not Found`, {
    status: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function findProvider(composedProviders, req) {
  return composedProviders.find((p) => p.matches(req))
}
