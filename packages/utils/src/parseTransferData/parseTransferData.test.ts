import { describe, expect, it } from 'vitest';
import { MindDropDataKey } from '../constants';
import { parseTransferData } from './parseTransferData';

describe('parseTransferData', () => {
  it('keeps plain entries as they are', () => {
    expect(parseTransferData({ 'text/plain': 'Hello' })).toEqual({
      'text/plain': 'Hello',
    });
  });

  it('strips the MindDrop prefix and JSON suffix and parses the value', () => {
    expect(
      parseTransferData({
        [`${MindDropDataKey}.entries+json`]: JSON.stringify(['entry-1']),
      }),
    ).toEqual({ entries: ['entry-1'] });
  });

  it('keeps a JSON value which fails to parse as a string', () => {
    expect(
      parseTransferData({ [`${MindDropDataKey}.entries+json`]: '{bad' }),
    ).toEqual({ entries: '{bad' });
  });

  it('skips empty plain entries', () => {
    expect(parseTransferData({ 'text/plain': '' })).toEqual({});
  });

  it('adds the files', () => {
    const file = new File([''], 'image.png', { type: 'image/png' });

    expect(parseTransferData({}, [file])).toEqual({ files: [file] });
  });

  it('collects the URLs of a URI list', () => {
    expect(
      parseTransferData({
        'text/uri-list': '# comment\nhttps://a.com\r\nhttps://b.com\n',
      }).urls,
    ).toEqual(['https://a.com', 'https://b.com']);
  });

  it('collects a plain text URL when there is no URI list', () => {
    expect(parseTransferData({ 'text/plain': 'https://a.com' }).urls).toEqual([
      'https://a.com',
    ]);
  });
});
