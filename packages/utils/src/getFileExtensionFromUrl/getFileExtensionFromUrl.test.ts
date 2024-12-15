import { describe, expect, it } from 'vitest';
import { getFileExtensionFromUrl } from './getFileExtensionFromUrl';

describe('getFileExtensionFromUrl', () => {
  it('should return the correct file extension for a valid URL with query parameters', () => {
    const url = 'https://example.com/image.png?version=123';
    expect(getFileExtensionFromUrl(url)).toBe('png');
  });

  it('should return the correct file extension for a valid URL without query parameters', () => {
    const url = 'https://example.com/image.jpeg';
    expect(getFileExtensionFromUrl(url)).toBe('jpeg');
  });

  it('should return null for a URL without a file extension', () => {
    const url = 'https://example.com/image';
    expect(getFileExtensionFromUrl(url)).toBeNull();
  });

  it('should handle complex URLs with multiple dots in the path', () => {
    const url = 'https://example.com/path.to.image/file.min.png';
    expect(getFileExtensionFromUrl(url)).toBe('png');
  });

  it('should handle URLs with special characters in the path', () => {
    const url = 'https://example.com/my-folder/image_test-123.JPG';
    expect(getFileExtensionFromUrl(url)).toBe('jpg'); // Lowercased
  });

  it('should return null for invalid URLs', () => {
    const url = 'not-a-valid-url';
    expect(getFileExtensionFromUrl(url)).toBeNull();
  });

  it('should return null for URLs with a dot but no valid extension', () => {
    const url = 'https://example.com/folder/.hiddenfile';
    expect(getFileExtensionFromUrl(url)).toBeNull();
  });

  it('should return null for an empty URL', () => {
    const url = '';
    expect(getFileExtensionFromUrl(url)).toBeNull();
  });

  it('should return null for URLs with trailing slashes after the file name', () => {
    const url = 'https://example.com/folder/image.png/';
    expect(getFileExtensionFromUrl(url)).toBeNull(); // Trailing slash means no valid file
  });

  it('should ignore fragments in the URL', () => {
    const url = 'https://example.com/image.png#section';
    expect(getFileExtensionFromUrl(url)).toBe('png');
  });
});
