import { Writable } from 'stream';
import fs from 'fs';
import https from 'https';
import http from 'http';
import nock from 'nock';
import { downloadFile } from './downloadFile';
import path from 'path';
import { DownloadFileError } from '@minddrop/files';
import { InvalidParameterError } from '@minddrop/utils';

const downloadFileContent = `{
  "foo": "bar"
}
`;

class WriteMemory extends Writable {
  buffer: string;

  constructor() {
    super();
    this.buffer = '';
  }

  _write(chunk, _, next) {
    this.buffer += chunk;
    next();
  }
}

let WriteStream: WriteMemory;

const mockCreateWriteStream = jest.fn().mockImplementation(() => {
  WriteStream = new WriteMemory();

  return WriteStream;
});

jest.mock('fs', () => ({
  ...(jest.requireActual('fs') as Object),
  createWriteStream: jest
    .fn()
    .mockImplementation(() => mockCreateWriteStream()),
  readFile: jest.fn().mockImplementation((path, options, callback) => {
    callback(null, 'base64-data');
  }),
  existsSync: jest.fn().mockReturnValue(true),
  unlink: jest
    .fn()
    .mockImplementation((path, callback) => callback({ message: 'error' })),
  unlinkSync: jest.fn(),
}));

jest.mock('@minddrop/utils', () => ({
  ...(jest.requireActual('@minddrop/utils') as Object),
  generateId: () => 'file-id',
}));

function mockSuccessfulRequest(url = 'https://example.com') {
  nock(url)
    .get('/some-file.json')
    .replyWithFile(
      200,
      path.resolve(__dirname, '../test-utils/download.json'),
      {
        'Content-Type': 'application/json',
        'Content-Length': '9001',
      },
    );
}

describe('downloadFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses https request for https URLs', async () => {
    // Arrange
    jest.spyOn(https, 'get');
    mockSuccessfulRequest();

    // Download from an https URL
    await downloadFile(
      'https://example.com/some-file.json',
      'path/to/download',
    );

    // Uses https call to download the file
    expect(https.get).toHaveBeenCalledWith(
      'https://example.com/some-file.json',
      expect.anything(),
    );
  });

  it('uses http request for http URLs', async () => {
    // Arrange
    jest.spyOn(http, 'get');
    mockSuccessfulRequest('http://example.com');

    // Act
    await downloadFile('http://example.com/some-file.json', 'path/to/download');

    // Uses http call to download the file
    expect(http.get).toHaveBeenCalledWith(
      'http://example.com/some-file.json',
      expect.anything(),
    );
  });

  it('saves the file to the specified path', async () => {
    // Arrange
    jest.spyOn(http, 'get');
    mockSuccessfulRequest('http://example.com');

    // Act
    await downloadFile('http://example.com/some-file.json', 'path/to/download');

    // Saves file to '.../path/to/download/file-id'
    expect(fs.createWriteStream).toHaveBeenCalledWith(
      path.resolve('path/to/download/file-id'),
    );
  });

  describe('moved URL', () => {
    it('handles 301 moved URLs', async () => {
      mockSuccessfulRequest('https://new-url.com');
      // Return a 301 status with a location header
      nock('https://example.com').get('/some-file.json').reply(301, undefined, {
        location: 'https://new-url.com/some-file.json',
      });

      // Act
      await downloadFile(
        'https://example.com/some-file.json',
        'path/to/download',
      );

      // Saves file successfuly
      expect(WriteStream.buffer).toBe(downloadFileContent);
    });

    it('handles 302 moved URLs', async () => {
      mockSuccessfulRequest('https://new-url.com');
      // Return a 302 status with a location header
      nock('https://example.com').get('/some-file.json').reply(302, undefined, {
        location: 'https://new-url.com/some-file.json',
      });

      // Act
      await downloadFile(
        'https://example.com/some-file.json',
        'path/to/download',
      );

      // Saves file successfuly
      expect(WriteStream.buffer).toBe(downloadFileContent);
    });

    it('handles 307 moved URLs', async () => {
      mockSuccessfulRequest('https://new-url.com');
      // Return a 307 status with a location header
      nock('https://example.com').get('/some-file.json').reply(307, undefined, {
        location: 'https://new-url.com/some-file.json',
      });

      // Act
      await downloadFile(
        'https://example.com/some-file.json',
        'path/to/download',
      );

      // Saves file successfuly
      expect(WriteStream.buffer).toBe(downloadFileContent);
    });

    it('does not try to read original file', async () => {
      mockSuccessfulRequest('https://new-url.com');
      // Return a 307 status with a location header
      nock('https://example.com').get('/some-file.json').reply(307, undefined, {
        location: 'https://new-url.com/some-file.json',
      });

      // Act
      await downloadFile(
        'https://example.com/some-file.json',
        'path/to/download',
      );

      // Should only call 'fs.readFile' once
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('throws if the new location is not provided', async () => {
      // Return a 301 status without a location header
      nock('https://example.com').get('/some-file.json').reply(301);

      // Should throw a `DownloadFileError`
      await expect(() =>
        downloadFile('https://example.com/some-file.json', 'path/to/download'),
      ).rejects.toThrowError(DownloadFileError);
    });
  });

  describe('success', () => {
    it('returns the base64 data', async () => {
      // Arrange
      jest.spyOn(fs, 'readFile');
      mockSuccessfulRequest('http://example.com');

      // Act
      const result = await downloadFile(
        'http://example.com/some-file.json',
        'path/to/download',
      );

      // Should return base64 data
      expect(result.base64).toBe('base64-data');
      // Should get the data as base64 from the downloaded file
      expect(fs.readFile).toHaveBeenCalledWith(
        path.resolve('path/to/download/file-id'),
        { encoding: 'base64' },
        expect.anything(),
      );
    });

    it('returns the file metadata', async () => {
      // Arrange
      mockSuccessfulRequest('http://example.com');

      // Act
      const result = await downloadFile(
        'http://example.com/some-file.json',
        'path/to/download',
      );

      // Metadata should contain file name
      expect(result.metadata.name).toBe('some-file.json');
      expect(result.metadata.type).toBe('application/json');
      expect(result.metadata.size).toBe(9001);
    });

    it('deletes the file', async () => {
      // Arrange
      jest.spyOn(fs, 'readFile');
      mockSuccessfulRequest('http://example.com');

      // Act
      await downloadFile(
        'http://example.com/some-file.json',
        'path/to/download',
      );

      // Should delete the file
      expect(fs.unlinkSync).toHaveBeenCalledWith(
        path.resolve('path/to/download/file-id'),
      );
    });
  });

  describe('request error', () => {
    it('throws if the url is invalid', async () => {
      // Call with an invalid URL, should throw a `InvalidParameterError`
      await expect(() =>
        downloadFile('foo', 'path/to/download'),
      ).rejects.toThrowError(InvalidParameterError);
    });

    it('throws if the download path is missing', async () => {
      // Call without a download path, should throw a `InvalidParameterError`
      await expect(() =>
        // @ts-ignore
        downloadFile('https://example.com/some-file.json'),
      ).rejects.toThrowError(InvalidParameterError);
    });

    it('throws if the download path is invalid', async () => {
      // Arrange
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

      // Call without a download path, should throw a `InvalidParameterError`
      await expect(() =>
        downloadFile('https://example.com/some-file.json', 'invalid-path'),
      ).rejects.toThrowError(InvalidParameterError);
    });

    it('throws if the request responds with a non 200, 301, 307 code', async () => {
      // Return a 204 (no content) status
      nock('https://example.com').get('/some-file.json').reply(204);

      // Should throw a `DownloadFileError`
      await expect(() =>
        downloadFile('https://example.com/some-file.json', 'path/to/download'),
      ).rejects.toThrowError(DownloadFileError);
    });

    it('throws if the request fails', async () => {
      // Return an error
      nock('https://example.com')
        .get('/some-file.json')
        .replyWithError('An error occured');

      // Should throw a `DownloadFileError`
      await expect(() =>
        downloadFile('https://example.com/some-file.json', 'path/to/download'),
      ).rejects.toThrowError(DownloadFileError);

      // Should delete the file
      expect(fs.unlink).toHaveBeenCalledWith(
        path.resolve('path/to/download/file-id'),
        expect.anything(),
      );
    });
  });
});
