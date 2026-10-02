import { describe, expect, it } from 'bun:test';
import { withCors } from './withCors';

describe('withCors', () => {
  it('keeps the wrapped response status', () => {
    const wrapped = withCors(
      new Response('x', { status: 404, statusText: 'Not Found' }),
    );

    expect(wrapped.status).toBe(404);
    expect(wrapped.statusText).toBe('Not Found');
  });

  it('sets the CORS headers', () => {
    const wrapped = withCors(new Response('x'));

    expect(wrapped.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it("keeps the wrapped response's own headers", () => {
    const wrapped = withCors(
      new Response('x', { headers: { 'Content-Type': 'image/png' } }),
    );

    expect(wrapped.headers.get('Content-Type')).toBe('image/png');
  });
});
