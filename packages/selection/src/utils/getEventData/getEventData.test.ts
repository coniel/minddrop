import { describe, expect, it, vi } from 'vitest';
import { MindDropDataKey } from '../../constants';
import { getEventData } from './getEventData';

// Helper to create mock DataTransfer
function createMockDataTransfer(
  data: Record<string, string> = {},
  files: File[] = [],
) {
  const types = Object.keys(data);

  if (files.length > 0) {
    types.push('Files');
  }

  return {
    types,
    getData: (type: string) => data[type] || '',
    files: files.length > 0 ? files : { length: 0 },
  };
}

// Helper to create mock drag event
function createMockDragEvent(
  data: Record<string, string> = {},
  files: File[] = [],
): React.DragEvent {
  return {
    dataTransfer: createMockDataTransfer(data, files),
  } as unknown as React.DragEvent;
}

// Helper to create mock clipboard event
function createMockClipboardEvent(
  data: Record<string, string> = {},
  files: File[] = [],
): React.ClipboardEvent {
  return {
    clipboardData: createMockDataTransfer(data, files),
  } as unknown as React.ClipboardEvent;
}

describe('getEventData', () => {
  describe('basic data extraction', () => {
    it('should extract text/plain data', () => {
      const event = createMockDragEvent({
        'text/plain': 'Hello world',
      });

      const result = getEventData(event);

      expect(result['text/plain']).toBe('Hello world');
    });

    it('should extract text/html data', () => {
      const event = createMockDragEvent({
        'text/html': '<p>Hello world</p>',
      });

      const result = getEventData(event);

      expect(result['text/html']).toBe('<p>Hello world</p>');
    });

    it('should extract multiple data types', () => {
      const event = createMockDragEvent({
        'text/plain': 'Hello',
        'text/html': '<p>Hello</p>',
      });

      const result = getEventData(event);

      expect(result['text/plain']).toBe('Hello');
      expect(result['text/html']).toBe('<p>Hello</p>');
    });

    it('should work with clipboard events', () => {
      const event = createMockClipboardEvent({
        'text/plain': 'Clipboard text',
      });

      const result = getEventData(event);

      expect(result['text/plain']).toBe('Clipboard text');
    });

    it('should skip empty string values', () => {
      const event = createMockDragEvent({
        'text/plain': '',
        'text/html': '<p>Content</p>',
      });

      const result = getEventData(event);

      expect(result['text/plain']).toBeUndefined();
      expect(result['text/html']).toBe('<p>Content</p>');
    });

    it('should skip Files type in dataTransfer.types', () => {
      const event = createMockDragEvent({
        'text/plain': 'Hello',
      });
      // Manually add Files to types
      // @ts-expect-error Mocked for test
      event.dataTransfer.types.push('Files');

      const result = getEventData(event);

      expect(result['text/plain']).toBe('Hello');
      // @ts-expect-error Should be undefined
      expect(result['Files']).toBeUndefined();
    });
  });

  describe('MindDrop mime type handling', () => {
    it('should remove MindDrop data key prefix', () => {
      const event = createMockDragEvent({
        [`${MindDropDataKey}.custom`]: 'custom data',
      });

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['custom']).toBe('custom data');
      expect(result[`${MindDropDataKey}.custom`]).toBeUndefined();
    });

    it('should handle multiple MindDrop prefixed keys', () => {
      const event = createMockDragEvent({
        [`${MindDropDataKey}.type1`]: 'data1',
        [`${MindDropDataKey}.type2`]: 'data2',
      });

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['type1']).toBe('data1');
      expect(result['type2']).toBe('data2');
    });
  });

  describe('JSON data handling', () => {
    it('should parse JSON data with +json suffix', () => {
      const jsonData = { foo: 'bar', count: 42 };
      const event = createMockDragEvent({
        'custom+json': JSON.stringify(jsonData),
      });

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['custom']).toEqual(jsonData);
    });

    it('should parse MindDrop JSON data', () => {
      const jsonData = { id: '123', name: 'test' };
      const event = createMockDragEvent({
        [`${MindDropDataKey}.custom+json`]: JSON.stringify(jsonData),
      });

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['custom']).toEqual(jsonData);
    });

    it('should handle malformed JSON gracefully', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const event = createMockDragEvent({
        'custom+json': '{invalid json}',
      });

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['custom']).toBe('{invalid json}');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should preserve falsy JSON values', () => {
      const event = createMockDragEvent({
        'data+json': JSON.stringify(null),
      });

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['data']).toBeNull();
    });
  });

  describe('file handling', () => {
    it('should extract files from drag event', () => {
      const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });
      const event = createMockDragEvent({}, [file1, file2]);

      const result = getEventData(event);

      expect(result.files).toHaveLength(2);
      expect(result.files?.[0]).toBe(file1);
      expect(result.files?.[1]).toBe(file2);
    });

    it('should not add files key when no files present', () => {
      const event = createMockDragEvent({
        'text/plain': 'text',
      });

      const result = getEventData(event);

      expect(result.files).toBeUndefined();
    });

    it('should extract files from clipboard event', () => {
      const file = new File(['content'], 'file.txt', { type: 'text/plain' });
      const event = createMockClipboardEvent({}, [file]);

      const result = getEventData(event);

      expect(result.files).toHaveLength(1);
      expect(result.files?.[0]).toBe(file);
    });
  });

  describe('URL handling from text/uri-list', () => {
    it('should parse single URL from text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list': 'https://example.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com']);
    });

    it('should parse multiple URLs from text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list':
          'https://example.com\nhttps://test.com\nhttps://demo.org',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual([
        'https://example.com',
        'https://test.com',
        'https://demo.org',
      ]);
    });

    it('should handle Windows line endings in text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list': 'https://example.com\r\nhttps://test.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com', 'https://test.com']);
    });

    it('should filter out comments from text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list':
          '# This is a comment\nhttps://example.com\n# Another comment\nhttps://test.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com', 'https://test.com']);
    });

    it('should filter out empty lines from text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list': 'https://example.com\n\n\nhttps://test.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com', 'https://test.com']);
    });

    it('should trim whitespace from URLs in text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list': '  https://example.com  \n  https://test.com  ',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com', 'https://test.com']);
    });

    it('should filter out invalid URLs from text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list': 'https://example.com\nnot-a-url\nhttps://test.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com', 'https://test.com']);
    });

    it('should not add urls key if no valid URLs in text/uri-list', () => {
      const event = createMockDragEvent({
        'text/uri-list': '# Just comments\n# More comments',
      });

      const result = getEventData(event);

      expect(result.urls).toBeUndefined();
    });
  });

  describe('URL handling from text/plain', () => {
    it('should detect URL in text/plain and add to urls', () => {
      const event = createMockDragEvent({
        'text/plain': 'https://example.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com']);
      expect(result['text/plain']).toBe('https://example.com');
    });

    it('should trim whitespace from text/plain before checking if URL', () => {
      const event = createMockDragEvent({
        'text/plain': '  https://example.com  ',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com']);
    });

    it('should not add urls if text/plain is not a URL', () => {
      const event = createMockDragEvent({
        'text/plain': 'Just some text',
      });

      const result = getEventData(event);

      expect(result.urls).toBeUndefined();
      expect(result['text/plain']).toBe('Just some text');
    });

    it('should prioritize text/uri-list over text/plain for URLs', () => {
      const event = createMockDragEvent({
        'text/uri-list': 'https://from-uri-list.com',
        'text/plain': 'https://from-plain.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://from-uri-list.com']);
    });

    it('should handle text/plain URL when text/uri-list is empty', () => {
      const event = createMockDragEvent({
        'text/uri-list': '',
        'text/plain': 'https://example.com',
      });

      const result = getEventData(event);

      expect(result.urls).toEqual(['https://example.com']);
    });

    it('should not add urls if text/plain is not a string', () => {
      const event = createMockDragEvent({
        'text/plain+json': JSON.stringify({ url: 'https://example.com' }),
      });

      const result = getEventData(event);

      expect(result.urls).toBeUndefined();
    });
  });

  describe('complex scenarios', () => {
    it('should handle combination of files, URLs, and text', () => {
      const file = new File(['content'], 'file.txt', { type: 'text/plain' });
      const event = createMockDragEvent(
        {
          'text/plain': 'https://example.com',
          'text/html': '<a href="https://example.com">Link</a>',
        },
        [file],
      );

      const result = getEventData(event);

      expect(result['text/plain']).toBe('https://example.com');
      expect(result['text/html']).toBe(
        '<a href="https://example.com">Link</a>',
      );
      expect(result.urls).toEqual(['https://example.com']);
      expect(result.files).toHaveLength(1);
    });

    it('should handle MindDrop data with files and URLs', () => {
      const jsonData = { id: '123' };
      const file = new File(['content'], 'file.txt', { type: 'text/plain' });
      const event = createMockDragEvent(
        {
          [`${MindDropDataKey}.custom+json`]: JSON.stringify(jsonData),
          'text/uri-list': 'https://example.com',
        },
        [file],
      );

      const result = getEventData<Record<string, unknown>>(event);

      expect(result['custom']).toEqual(jsonData);
      expect(result.urls).toEqual(['https://example.com']);
      expect(result.files).toHaveLength(1);
    });
  });

  describe('type parameter', () => {
    it('should support generic type parameter', () => {
      interface CustomData {
        'text/plain': string;
        customField: string;
      }

      const event = createMockDragEvent({
        'text/plain': 'text',
        customField: 'custom',
      });

      const result = getEventData<CustomData>(event);

      expect(result['text/plain']).toBe('text');
      expect(result.customField).toBe('custom');
    });
  });
});
