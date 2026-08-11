import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateMediaFileName } from './generateMediaFileName';

const MOCK_UUID = 'test-uuid-5678';
const mockDate = new Date('2026-01-01T00:00:00.000Z');
const MOCK_BASE_NAME = `${mockDate.getTime()}-${MOCK_UUID}`;

vi.mock('@minddrop/utils', async () => {
  const actual = await vi.importActual('@minddrop/utils');

  return {
    ...actual,
    uuid: () => MOCK_UUID,
  };
});

describe('generateMediaFileName', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: mockDate });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('preserves the extension of a file name', () => {
    expect(generateMediaFileName('photo.jpg')).toBe(`${MOCK_BASE_NAME}.jpg`);
  });

  it('preserves the extension of a file path', () => {
    expect(generateMediaFileName('path/to/photo.webp')).toBe(
      `${MOCK_BASE_NAME}.webp`,
    );
  });

  it('handles a source without an extension', () => {
    expect(generateMediaFileName('README')).toBe(MOCK_BASE_NAME);
  });
});
