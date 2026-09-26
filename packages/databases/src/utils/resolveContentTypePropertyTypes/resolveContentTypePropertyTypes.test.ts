import { describe, expect, it } from 'vitest';
import { resolveContentTypePropertyTypes } from './resolveContentTypePropertyTypes';

describe('resolveContentTypePropertyTypes', () => {
  it('resolves text to the content property type', () => {
    expect(resolveContentTypePropertyTypes('text')).toEqual(['content']);
  });

  it('resolves URLs to the URL property type', () => {
    expect(resolveContentTypePropertyTypes('url')).toEqual(['url']);
  });

  it('resolves images to the file and image property types', () => {
    expect(resolveContentTypePropertyTypes('image')).toEqual(['file', 'image']);
  });

  it('resolves each specific file type to the file property type and its own', () => {
    expect(resolveContentTypePropertyTypes('pdf')).toEqual(['file', 'pdf']);
    expect(resolveContentTypePropertyTypes('audio')).toEqual(['file', 'audio']);
    expect(resolveContentTypePropertyTypes('video')).toEqual(['file', 'video']);
  });

  it('resolves other files to the file property type', () => {
    expect(resolveContentTypePropertyTypes('file')).toEqual(['file']);
  });
});
