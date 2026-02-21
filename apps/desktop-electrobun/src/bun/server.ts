import { serve } from 'bun';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'path';

// Basic MIME type helper
function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  return (
    {
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
    }[ext] || 'application/octet-stream'
  );
}

// Wrap response with CORS headers
function withCors(res: Response) {
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(res.body, { ...res, headers });
}

serve({
  port: 14567,
  maxRequestBodySize: 100 * 1024 * 1024 * 1024, // 100 GB
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === 'OPTIONS')
      return withCors(new Response(null, { status: 204 }));

    switch (url.pathname) {
      case '/files': {
        const filePath = url.searchParams.get('path');

        if (!filePath)
          return withCors(new Response('Missing path', { status: 400 }));

        try {
          const stat = await fsp.stat(filePath);

          if (!stat.isFile())
            return withCors(new Response('Not a file', { status: 400 }));

          const data = await fsp.readFile(filePath);
          const mimeType = getMimeType(filePath);

          return withCors(
            new Response(data, {
              headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'private, max-age=31536000, immutable',
              },
            }),
          );
        } catch {
          return withCors(
            new Response(`File not found: ${filePath}`, { status: 404 }),
          );
        }
      }

      case '/upload': {
        if (req.method !== 'POST')
          return withCors(new Response('Method Not Allowed', { status: 405 }));

        const filePath = url.searchParams.get('path');

        if (!filePath)
          return withCors(new Response('Missing path', { status: 400 }));

        try {
          // Stream the request body directly to disk
          const fileStream = fs.createWriteStream(filePath);
          const reader = req.body!.getReader();

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;
            fileStream.write(value);
          }
          fileStream.end();

          return withCors(new Response('File uploaded', { status: 200 }));
        } catch (err) {
          console.error(err);

          return withCors(new Response('Upload failed', { status: 500 }));
        }
      }

      default:
        return withCors(new Response('Invalid path', { status: 400 }));
    }
  },
});
