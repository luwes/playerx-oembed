/* globals HTMLRewriter */

export async function scrapeHTML(oldResponse, scrapeRules) {
  const rewriter = new HTMLRewriter();
  const data = {};

  for (const prop in scrapeRules) {
    const { selector, value } = scrapeRules[prop];
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
