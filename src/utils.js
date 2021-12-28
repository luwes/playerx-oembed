export async function getFileHeaders(url) {
  const result = await fetch(url, { method: 'HEAD' })
  return Object.fromEntries(result.headers.entries())
}

export function secondsToISOString(seconds) {
  let Y = Math.floor(seconds / 60 / 60 / 24 / 365)
  let M = Math.floor((seconds / 60 / 60 / 24 / 30.42) % 12)
  let D = Math.floor((seconds / 60 / 60 / 24) % 30.42)
  let h = Math.floor((seconds / 60 / 60) % 24)
  let m = Math.floor((seconds / 60) % 60)
  let s = Math.floor(seconds % 60)

  if (!seconds) {
    return 'P0D'
  }

  return (
    (seconds < 0 ? '-' : '') +
    'P' +
    (Y ? Y + 'Y' : '') +
    (M ? M + 'M' : '') +
    (D ? D + 'D' : '') +
    (h || m || s ? 'T' : '') +
    (h ? h + 'H' : '') +
    (m ? m + 'M' : '') +
    (s ? s + 'S' : '')
  )
}

export function getMaxDimensions(sources) {
  let rect = {}
  sources.forEach(({ width, height }) => {
    if (width && (width > rect.width || rect.width == null))
      rect.width = width
    if (height && (height > rect.height || rect.height == null))
      rect.height = height
  })
  return rect
}

export async function jpegDimensions(jpgUrl) {
  if (!jpgUrl) return {}

  let buffer = new Uint8Array(await (await fetch(jpgUrl)).arrayBuffer())

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
