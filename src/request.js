/**
 * Create a new request info object.
 * @param  {Request} request
 * @return {Object}
 */
export function createRequest(request) {
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
