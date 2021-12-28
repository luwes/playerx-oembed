export function render(evt, data) {
  if (data.embed_url) {
    return Response.redirect(decodeEntities(data.embed_url), 301)
  }

  const html = `<!DOCTYPE html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes">
  <title>${data.title || ''}</title>
  <style>
    html,
    body {
      height: 100%;
    }
    body {
      margin: 0;
      background-color: #000;
    }
    .plx-body > * {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body class="plx-body">
  ${data.html}
</body>`

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  })
}

function decodeEntities(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g
  var translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  }
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity]
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      var num = parseInt(numStr, 10)
      return String.fromCharCode(num)
    })
}
