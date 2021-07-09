/* globals HTMLRewriter */

export async function scraper(contentUrl, scrape) {
  const oldResponse = await fetch(contentUrl);
  const rewriter = new HTMLRewriter();
  const data = {};

  for (const prop in scrape) {
    const { selector, value } = scrape[prop];
    rewriter.on(selector, {
      element(element) {
        data[prop] = value(element);
      }
    })
  }

  await rewriter
    .transform(oldResponse)
    .arrayBuffer();

  return data;
}
