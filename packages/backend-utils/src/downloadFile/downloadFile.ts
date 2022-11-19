import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import isUrl from 'is-url';
import { generateId, InvalidParameterError } from '@minddrop/utils';
import { DownloadFileError } from '@minddrop/files';

export interface FileDownloadData {
  base64: string;
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}

/**
 * Downloads a file and returns it in base64 format
 * along with metadata about the file.
 *
 * Deletes the downloaded after after returning the data.
 *
 * Handles 301, 302, and 307 (moved) responses by calling itself
 * recursively with the new location if provided by the response.
 *
 * @param url - The URL from which to download the file.
 * @param downloadPath - The path to which to download the file.
 * @returns The file base64 data and metadata.
 *
 * @throws DownloadFileError
 * Thrown if the download fails.
 */
export async function downloadFile(
  url: string,
  downloadPath: string,
): Promise<FileDownloadData> {
  // Validate the URL
  if (!isUrl(url)) {
    throw new InvalidParameterError(`Invalid URL: '${url}'`);
  }

  // Validate the download path
  if (!downloadPath) {
    throw new InvalidParameterError('download path is required');
  }

  // Validate the download path
  if (!fs.existsSync(downloadPath)) {
    throw new InvalidParameterError(
      `download path ${downloadPath} does not exist`,
    );
  }

  let moved = false;
  // Temporary file name
  const tempFileName = generateId();
  // The download path complete with file name
  const filePath = path.resolve(downloadPath, tempFileName);
  // Chose between an http and a https requested based on
  // the URL's protocol.
  const protocol = url.charAt(4) === 's' ? https : http;
  // The file's metadata
  const metadata = {
    // Get the file name from the URL
    name: url.split('#').shift().split('?').shift().split('/').pop(),
    type: '',
    size: 0,
  };

  try {
    const result = await new Promise<FileDownloadData>((resolve, reject) => {
      try {
        // Download the file to the provided path
        const stream = fs.createWriteStream(filePath);

        const request = protocol.get(url, async (response) => {
          if (
            // Status code is 'moved'
            [301, 302, 307].includes(response.statusCode) &&
            // New location was provided
            response.headers.location
          ) {
            // File has moved
            moved = true;

            if (response.headers.location) {
              // Download the file from the new location
              const result = await downloadFile(
                response.headers.location,
                downloadPath,
              );

              // Resolve with the data
              resolve(result);
            }
          } else if (response.statusCode !== 200) {
            // If the status code is not 200 (OK), throw a
            // `DownloadFileError`.
            reject(
              response.statusMessage ||
                `server responsed with ${response.statusCode}`,
            );

            // Stop here
            return;
          }

          // Get the type and size metadata from headers
          metadata.type = response.headers['content-type'];
          metadata.size = parseInt(response.headers['content-length'], 10);

          // Write the file to disc
          response.pipe(stream);
        });

        stream.on('finish', async () => {
          if (moved) {
            // If the file has moved, do nothing further with
            // this request.
            return;
          }

          // Get the file as a base64 string
          fs.readFile(filePath, { encoding: 'base64' }, (err, base64) => {
            // Resolve with the base64 data and metadata
            resolve({ base64, metadata });

            // Delete the file
            fs.unlinkSync(filePath);
          });
        });

        request.on('error', (error) => {
          // Delete the file and reject with the error message
          fs.unlink(filePath, () => {
            reject(error.message);
          });
        });

        stream.on('error', (error) => {
          // Delete the file and reject with the error message
          fs.unlink(filePath, () => {
            reject(error.message);
          });
        });

        request.end();
      } catch (error) {
        // Reject with the error message
        reject(error.message);
      }
    });

    return result;
  } catch (error) {
    // Throw a `DownlodFileError` with the error message
    throw new DownloadFileError(error.message);
  }
}
