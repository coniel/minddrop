import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn,
} from 'bun:test';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { mockElectrobun } from '../test-utils/mockElectrobun';
import { waitForCondition } from '../test-utils/waitForCondition';

mockElectrobun();

const { httpServer } = await import('./server');

let tempDir: string;

describe('httpServer', () => {
  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'minddrop-server-'));
  });

  afterEach(async () => {
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  afterAll(() => {
    httpServer.stop(true);
  });

  describe('/files', () => {
    // Kept apart from the pin below, which passes on any failure. A
    // file the server fails to serve fails this test instead of
    // passing as the pinned bug.
    it('serves a file', async () => {
      const { response } = await fetchServedFile();

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('Image');
    });

    // Pins Issue 61: /files serves images as immutable for a year. They
    // are keyed only by path. Remove .failing once fixed.
    it.failing('makes the webview revalidate a served file', async () => {
      const { filePath, url, response } = await fetchServedFile();
      const cacheControl = response.headers.get('Cache-Control') ?? '';

      // Rewrite the file with a later modification time
      const later = new Date(Date.now() + 60000);
      await fsp.writeFile(filePath, 'New image');
      await fsp.utimes(filePath, later, later);

      // Revalidate the file with the first response's validators
      const revalidated = await fetch(url, {
        headers: resolveRevalidationHeaders(response.headers),
      });

      expect(cacheControl).not.toMatch(/immutable/);
      expect(cacheControl).toMatch(/no-cache|no-store|max-age=0\b/);
      expect(await revalidated.text()).toBe('New image');
    });
  });

  describe('/upload', () => {
    // Kept apart from the pin below, which passes on any failure. A
    // write which succeeds, or whose error goes unhandled, fails this
    // test instead of passing as the pinned bug.
    it('fails to write a file into a missing directory', async () => {
      const { writeErrors } = await uploadUnwritableFile();

      await waitForCondition(() => writeErrors.length > 0);

      expect(writeErrors[0]).toMatchObject({ code: 'ENOENT' });
    });

    // Pins Issue 60: The upload endpoint returns 200 before the stream
    // has flushed. Remove .failing once fixed.
    it.failing(
      'responds with a failure when the file cannot be written',
      async () => {
        const { response } = await uploadUnwritableFile();

        expect(response.ok).toBe(false);
      },
    );

    // Pins Issue 60: The upload endpoint returns 200 before the stream
    // has flushed. Remove .failing once fixed.
    it.failing(
      'handles the write error of a file which cannot be written',
      async () => {
        // Target a missing directory. The write then fails.
        const filePath = path.join(tempDir, 'missing', 'video.mp4');

        // Upload the file. `bun test` fails the running test on an
        // unhandled error before process listeners see it. The write
        // error surfaces before the response arrives.
        const response = await uploadFile(filePath);

        expect(response).toBeInstanceOf(Response);
      },
    );
  });
});

/**
 * Writes a file and fetches it from the server.
 *
 * @returns The file's path, its server URL and the server's response.
 */
async function fetchServedFile(): Promise<{
  filePath: string;
  url: string;
  response: Response;
}> {
  // Write a file to serve
  const filePath = path.join(tempDir, 'cover.png');
  await fsp.writeFile(filePath, 'Image');

  // Fetch the file
  const url = resolveServerFileUrl('/files', filePath);
  const response = await fetch(url);

  return { filePath, url, response };
}

/**
 * Uploads a file into a missing directory, collecting the errors of
 * the write. An unhandled write error would fail the running test on
 * its own.
 *
 * @returns The server's response, and the write errors collected so
 *   far.
 */
async function uploadUnwritableFile(): Promise<{
  response: Response;
  writeErrors: Error[];
}> {
  // Target a missing directory. The write then fails.
  const filePath = path.join(tempDir, 'missing', 'video.mp4');

  // Collect the write stream's errors
  const writeErrors: Error[] = [];
  const createWriteStream = fs.createWriteStream;
  const createWriteStreamSpy = spyOn(
    fs,
    'createWriteStream',
  ).mockImplementation((...args) =>
    createWriteStream(...args).on('error', (error) => {
      writeErrors.push(error);
    }),
  );

  // Upload the file
  try {
    const response = await uploadFile(filePath);

    return { response, writeErrors };
  } finally {
    // Restore createWriteStream
    createWriteStreamSpy.mockRestore();
  }
}

/**
 * Returns the server URL of an endpoint taking a file path.
 *
 * @param endpoint - The endpoint's path.
 * @param filePath - The file path to pass to the endpoint.
 * @returns The endpoint's URL.
 */
function resolveServerFileUrl(endpoint: string, filePath: string): string {
  return `http://localhost:${httpServer.port}${endpoint}?path=${encodeURIComponent(filePath)}`;
}

/**
 * Uploads a file to the server.
 *
 * @param filePath - The path to upload the file to.
 * @returns The server's response.
 */
function uploadFile(filePath: string): Promise<Response> {
  return fetch(resolveServerFileUrl('/upload', filePath), {
    method: 'POST',
    body: 'Video',
  });
}

/**
 * Returns the conditional request headers which revalidate a response
 * with its validators.
 *
 * @param headers - The response's headers.
 * @returns The conditional request headers.
 */
function resolveRevalidationHeaders(headers: Headers): Record<string, string> {
  // Read the response's validators
  const conditionalHeaders: Record<string, string> = {};
  const etag = headers.get('ETag');
  const lastModified = headers.get('Last-Modified');

  // Revalidate by ETag, if the response has one
  if (etag) {
    conditionalHeaders['If-None-Match'] = etag;
  }

  // Revalidate by modification time, if the response has one
  if (lastModified) {
    conditionalHeaders['If-Modified-Since'] = lastModified;
  }

  return conditionalHeaders;
}
