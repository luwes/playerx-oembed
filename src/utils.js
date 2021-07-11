
export async function getFileHeaders(url) {
  const result = await fetch(url, { method: 'HEAD' });
  return Object.fromEntries(result.headers.entries());
}
