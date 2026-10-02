/**
 * Returns a copy of a response with the CORS headers the webview
 * needs set on it.
 *
 * @param response - The response to copy.
 * @returns The response with the CORS headers.
 */
export function withCors(response: Response): Response {
  // Add the CORS headers to the response's own
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Copy the status and status text by hand. A Response's fields are
  // prototype getters, so spreading one copies nothing.
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
