import { getFileHeaders } from '../utils.js'

export default {
  patterns: [/https?:\/\/stream\.mux\.com\/(\w+)/],

  name: 'MUX',

  options: '',

  oembed: {
    type: 'video',
    version: '1.0',
    provider_name: 'MUX',
    provider_url: 'https://mux.com/',
  },

  async serialize(data, req) {
    const thumbnail_url = `https://image.mux.com/${req.captures[1]}/thumbnail.jpg`
    const thumbHeaders = await getFileHeaders(thumbnail_url)

    let img
    if (thumbHeaders['content-type'] === 'image/jpeg') {
      const blob = new Uint8Array(
        await (await fetch(thumbnail_url)).arrayBuffer(),
      )
      img = detectJpeg(blob)
    }

    return {
      ...data,
      thumbnail_url,
      thumbnail_width: img.width,
      thumbnail_height: img.height,
      width: img.width,
      height: img.height,
      html: `<script src="https://cdn.jsdelivr.net/npm/@mux-elements/mux-video@0.2.0/dist/index.js"></script>
<mux-video src="${req.url}"</mux-video>`,
    }
  },
}

function pad(str) {
  return ('00' + str).slice(-2)
}

function validateBuffer(buffer, i) {
  // index should be within buffer limits
  if (i > buffer.length) {
    throw new TypeError('Corrupt JPG, exceeded buffer limits')
  }
  // Every JPEG block must begin with a 0xFF
  if (buffer[i] !== 0xff) {
    console.log('BLOCK #: ', buffer[i].toString(16))
    throw new TypeError('Invalid JPG, marker table corrupted')
  }
}

function detectJpeg(buffer) {
  let width, height, next
  buffer = buffer.slice(4, 1024 * 1024)

  let blockLen, prevBlock
  while (buffer.length) {
    blockLen = parseInt(
      pad(buffer[0].toString(16)) + pad(buffer[1].toString(16)),
      16,
    )

    if (blockLen !== prevBlock) {
      validateBuffer(buffer, blockLen)
      prevBlock = blockLen
    }

    next = buffer[blockLen + 1]
    if (next === 0xc0 || next === 0xc1 || next === 0xc2) {
      let heightMarker =
        pad(buffer[blockLen + 5].toString(16)) +
        pad(buffer[blockLen + 6].toString(16))
      let widthMarker =
        pad(buffer[blockLen + 7].toString(16)) +
        pad(buffer[blockLen + 8].toString(16))
      width = parseInt(widthMarker, 16)
      height = parseInt(heightMarker, 16)
      break
    }
    buffer = buffer.slice(blockLen + 2)
  }
  return { width, height }
}
