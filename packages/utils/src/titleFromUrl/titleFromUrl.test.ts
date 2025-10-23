import { describe, expect, it } from 'vitest';
import { titleFromUrl } from './titleFromUrl';

describe('titleFromUrl', () => {
  describe('titleFromUrl', () => {
    it('removes protocol from URL', () => {
      expect(titleFromUrl('https://example.com')).toBe('example.com');
      expect(titleFromUrl('http://example.com')).toBe('example.com');
      expect(titleFromUrl('ftp://example.com')).toBe('example.com');
    });

    it('removes file extensions', () => {
      expect(titleFromUrl('https://example.com/page.html')).toBe(
        'example.com_page',
      );
      expect(titleFromUrl('https://example.com/document.pdf')).toBe(
        'example.com_document',
      );
      expect(titleFromUrl('https://example.com/image.jpg')).toBe(
        'example.com_image',
      );
      expect(titleFromUrl('https://example.com/file.txt')).toBe(
        'example.com_file',
      );
    });

    it('decodes URL encoded characters', () => {
      expect(titleFromUrl('https://example.com/my%20document.html')).toBe(
        'example.com_my document',
      );
      expect(titleFromUrl('https://example.com/hello%20world%20test.pdf')).toBe(
        'example.com_hello world test',
      );
    });

    it('preserves spaces in output', () => {
      expect(titleFromUrl('https://example.com/my document')).toBe(
        'example.com_my document',
      );
    });

    it('replaces invalid filename characters with underscores', () => {
      expect(titleFromUrl('https://example.com/path<>:"|?*\\/file')).toBe(
        'example.com_path_file',
      );
    });

    it('removes trailing slashes', () => {
      expect(titleFromUrl('https://example.com/')).toBe('example.com');
      expect(titleFromUrl('https://example.com///')).toBe('example.com');
    });

    it('collapses multiple underscores', () => {
      expect(titleFromUrl('https://example.com/path___to___file')).toBe(
        'example.com_path_to_file',
      );
    });

    it('collapses multiple spaces', () => {
      expect(titleFromUrl('https://example.com/path   to   file')).toBe(
        'example.com_path to file',
      );
    });

    it('handles URLs with query parameters', () => {
      expect(titleFromUrl('https://example.com/page?query=1&test=2')).toBe(
        'example.com_page_query_1_test_2',
      );
    });

    it('handles URLs with ports', () => {
      expect(titleFromUrl('https://example.com:8080/page')).toBe(
        'example.com_8080_page',
      );
    });

    it('handles URLs with subdomains', () => {
      expect(titleFromUrl('https://subdomain.example.com/page')).toBe(
        'subdomain.example.com_page',
      );
    });

    it('returns "Untitled" for empty or invalid URLs', () => {
      expect(titleFromUrl('https://')).toBe('Untitled');
      expect(titleFromUrl('')).toBe('Untitled');
    });

    it('limits length to 200 characters', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(300);
      const result = titleFromUrl(longUrl);
      expect(result.length).toBeLessThanOrEqual(200);
    });

    it('handles complex real-world URLs', () => {
      expect(
        titleFromUrl('https://blog.example.com/2024/01/my-article-title.html'),
      ).toBe('blog.example.com_2024_01_my-article-title');
      expect(
        titleFromUrl(
          'https://docs.site.com/guide/installation%20instructions.pdf',
        ),
      ).toBe('docs.site.com_guide_installation instructions');
    });

    it('preserves hyphens and underscores', () => {
      expect(titleFromUrl('https://example.com/my-article_title')).toBe(
        'example.com_my-article_title',
      );
    });

    it('handles URLs without paths', () => {
      expect(titleFromUrl('https://example.com')).toBe('example.com');
    });
  });
});
