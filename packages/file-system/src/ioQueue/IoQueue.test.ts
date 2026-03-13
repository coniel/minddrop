import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseDirectory, FileSystemAdapter } from '../types';
import { IoQueue } from './IoQueue';

// Minimal mock adapter that only implements the methods
// the IoQueue uses
function createMockAdapter(
  files: Record<string, string> = {},
): FileSystemAdapter {
  return {
    readTextFiles: vi.fn(async (paths: string[]) => {
      const results = new Map<string, string>();

      for (const path of paths) {
        if (path in files) {
          results.set(path, files[path]);
        }
      }

      return results;
    }),
    writeTextFiles: vi.fn(async () => {}),
  } as unknown as FileSystemAdapter;
}

describe('IoQueue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('read', () => {
    it('batches concurrent reads into a single readTextFiles call', async () => {
      const adapter = createMockAdapter({
        'a.txt': 'content-a',
        'b.txt': 'content-b',
        'c.txt': 'content-c',
      });
      const queue = new IoQueue(adapter);

      // Queue three reads concurrently
      const promiseA = queue.read('a.txt');
      const promiseB = queue.read('b.txt');
      const promiseC = queue.read('c.txt');

      // Flush the debounce timer
      vi.advanceTimersByTime(10);

      const [resultA, resultB, resultC] = await Promise.all([
        promiseA,
        promiseB,
        promiseC,
      ]);

      // All reads should be in a single batch call
      expect(adapter.readTextFiles).toHaveBeenCalledTimes(1);
      expect(adapter.readTextFiles).toHaveBeenCalledWith(
        ['a.txt', 'b.txt', 'c.txt'],
        undefined,
      );

      expect(resultA).toBe('content-a');
      expect(resultB).toBe('content-b');
      expect(resultC).toBe('content-c');
    });

    it('deduplicates reads to the same path', async () => {
      const adapter = createMockAdapter({
        'a.txt': 'content-a',
      });
      const queue = new IoQueue(adapter);

      // Queue three reads for the same path
      const promise1 = queue.read('a.txt');
      const promise2 = queue.read('a.txt');
      const promise3 = queue.read('a.txt');

      vi.advanceTimersByTime(10);

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);

      // Only one path should appear in the batch call
      expect(adapter.readTextFiles).toHaveBeenCalledTimes(1);
      expect(adapter.readTextFiles).toHaveBeenCalledWith(['a.txt'], undefined);

      // All callers should receive the same result
      expect(result1).toBe('content-a');
      expect(result2).toBe('content-a');
      expect(result3).toBe('content-a');
    });

    it('rejects callers whose path is missing from the result', async () => {
      // Adapter returns nothing for missing paths
      const adapter = createMockAdapter({});
      const queue = new IoQueue(adapter);

      const promise = queue.read('missing.txt');

      vi.advanceTimersByTime(10);

      await expect(promise).rejects.toThrow('Failed to read file: missing.txt');
    });

    it('rejects all callers if the batch call fails', async () => {
      const adapter = createMockAdapter({});

      // Make readTextFiles reject
      (adapter.readTextFiles as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('RPC failure'),
      );

      const queue = new IoQueue(adapter);

      const promiseA = queue.read('a.txt');
      const promiseB = queue.read('b.txt');

      vi.advanceTimersByTime(10);

      await expect(promiseA).rejects.toThrow('RPC failure');
      await expect(promiseB).rejects.toThrow('RPC failure');
    });

    it('resets the debounce timer on new requests', async () => {
      const adapter = createMockAdapter({
        'a.txt': 'content-a',
        'b.txt': 'content-b',
      });
      const queue = new IoQueue(adapter);

      // Queue first read
      const promiseA = queue.read('a.txt');

      // Advance 8ms (not enough to flush)
      vi.advanceTimersByTime(8);

      // Queue second read, which resets the timer
      const promiseB = queue.read('b.txt');

      // Advance another 8ms (16ms total, but only 8ms since
      // the timer reset)
      vi.advanceTimersByTime(8);

      // Should not have flushed yet
      expect(adapter.readTextFiles).not.toHaveBeenCalled();

      // Advance the remaining 2ms
      vi.advanceTimersByTime(2);

      await Promise.all([promiseA, promiseB]);

      // Both reads should be in the same batch
      expect(adapter.readTextFiles).toHaveBeenCalledTimes(1);
    });

    it('groups reads by options (baseDir)', async () => {
      const adapter = createMockAdapter({
        'config.json': 'app-config',
        'data.json': 'app-data',
      });
      const queue = new IoQueue(adapter);

      // Queue reads with different baseDirs
      const promiseA = queue.read('config.json', {
        baseDir: BaseDirectory.AppData,
      });
      const promiseB = queue.read('data.json');

      vi.advanceTimersByTime(10);

      await Promise.all([promiseA, promiseB]);

      // Should be two separate batch calls (one per option group)
      expect(adapter.readTextFiles).toHaveBeenCalledTimes(2);
    });
  });

  describe('readMany', () => {
    it('merges with concurrent single reads into one flush', async () => {
      const adapter = createMockAdapter({
        'a.txt': 'content-a',
        'b.txt': 'content-b',
        'c.txt': 'content-c',
      });
      const queue = new IoQueue(adapter);

      // Mix single and batch reads
      const singlePromise = queue.read('a.txt');
      const batchPromise = queue.readMany(['b.txt', 'c.txt']);

      vi.advanceTimersByTime(10);

      const [singleResult, batchResult] = await Promise.all([
        singlePromise,
        batchPromise,
      ]);

      // All should be in a single batch call
      expect(adapter.readTextFiles).toHaveBeenCalledTimes(1);
      expect(adapter.readTextFiles).toHaveBeenCalledWith(
        ['a.txt', 'b.txt', 'c.txt'],
        undefined,
      );

      expect(singleResult).toBe('content-a');
      expect(batchResult.get('b.txt')).toBe('content-b');
      expect(batchResult.get('c.txt')).toBe('content-c');
    });

    it('omits failed paths from the result map', async () => {
      const adapter = createMockAdapter({
        'a.txt': 'content-a',
      });
      const queue = new IoQueue(adapter);

      const result = queue.readMany(['a.txt', 'missing.txt']);

      vi.advanceTimersByTime(10);

      const map = await result;

      expect(map.size).toBe(1);
      expect(map.get('a.txt')).toBe('content-a');
      expect(map.has('missing.txt')).toBe(false);
    });
  });

  describe('write', () => {
    it('batches concurrent writes into a single writeTextFiles call', async () => {
      const adapter = createMockAdapter();
      const queue = new IoQueue(adapter);

      // Queue three writes concurrently
      const promiseA = queue.write('a.txt', 'content-a');
      const promiseB = queue.write('b.txt', 'content-b');
      const promiseC = queue.write('c.txt', 'content-c');

      vi.advanceTimersByTime(10);

      await Promise.all([promiseA, promiseB, promiseC]);

      // All writes should be in a single batch call
      expect(adapter.writeTextFiles).toHaveBeenCalledTimes(1);
      expect(adapter.writeTextFiles).toHaveBeenCalledWith(
        [
          { path: 'a.txt', contents: 'content-a' },
          { path: 'b.txt', contents: 'content-b' },
          { path: 'c.txt', contents: 'content-c' },
        ],
        undefined,
      );
    });

    it('coalesces writes to the same path keeping only the last value', async () => {
      const adapter = createMockAdapter();
      const queue = new IoQueue(adapter);

      // Queue three writes to the same path
      const promise1 = queue.write('a.txt', 'first');
      const promise2 = queue.write('a.txt', 'second');
      const promise3 = queue.write('a.txt', 'third');

      vi.advanceTimersByTime(10);

      await Promise.all([promise1, promise2, promise3]);

      // Only the last write should be in the batch
      expect(adapter.writeTextFiles).toHaveBeenCalledTimes(1);
      expect(adapter.writeTextFiles).toHaveBeenCalledWith(
        [{ path: 'a.txt', contents: 'third' }],
        undefined,
      );
    });

    it('resolves superseded write callers immediately', async () => {
      const adapter = createMockAdapter();
      const queue = new IoQueue(adapter);

      let firstResolved = false;
      let secondResolved = false;

      // Queue two writes to the same path
      const promise1 = queue.write('a.txt', 'first').then(() => {
        firstResolved = true;
      });
      const promise2 = queue.write('a.txt', 'second').then(() => {
        secondResolved = true;
      });

      // The first caller should resolve immediately (before flush)
      await promise1;
      expect(firstResolved).toBe(true);
      expect(secondResolved).toBe(false);

      // Flush and wait for the second caller
      vi.advanceTimersByTime(10);
      await promise2;

      expect(secondResolved).toBe(true);
    });

    it('rejects all callers if the batch call fails', async () => {
      const adapter = createMockAdapter();

      (adapter.writeTextFiles as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Write failure'),
      );

      const queue = new IoQueue(adapter);

      const promiseA = queue.write('a.txt', 'content-a');
      const promiseB = queue.write('b.txt', 'content-b');

      vi.advanceTimersByTime(10);

      await expect(promiseA).rejects.toThrow('Write failure');
      await expect(promiseB).rejects.toThrow('Write failure');
    });

    it('resets the debounce timer on new requests', async () => {
      const adapter = createMockAdapter();
      const queue = new IoQueue(adapter);

      // Queue first write
      queue.write('a.txt', 'content-a');

      // Advance 8ms (not enough to flush)
      vi.advanceTimersByTime(8);

      // Queue second write, which resets the timer
      queue.write('b.txt', 'content-b');

      // Advance another 8ms
      vi.advanceTimersByTime(8);

      // Should not have flushed yet
      expect(adapter.writeTextFiles).not.toHaveBeenCalled();

      // Advance the remaining 2ms
      vi.advanceTimersByTime(2);

      // Wait for flush to complete
      await vi.advanceTimersByTimeAsync(0);

      // Both writes should be in the same batch
      expect(adapter.writeTextFiles).toHaveBeenCalledTimes(1);
    });

    it('groups writes by options (baseDir)', async () => {
      const adapter = createMockAdapter();
      const queue = new IoQueue(adapter);

      // Queue writes with different baseDirs
      queue.write('config.json', 'config', { baseDir: BaseDirectory.AppData });
      queue.write('data.json', 'data');

      vi.advanceTimersByTime(10);

      // Wait for flush to complete
      await vi.advanceTimersByTimeAsync(0);

      // Should be two separate batch calls (one per option group)
      expect(adapter.writeTextFiles).toHaveBeenCalledTimes(2);
    });
  });

  describe('writeMany', () => {
    it('merges with concurrent single writes into one flush', async () => {
      const adapter = createMockAdapter();
      const queue = new IoQueue(adapter);

      // Mix single and batch writes
      const singlePromise = queue.write('a.txt', 'content-a');
      const batchPromise = queue.writeMany([
        { path: 'b.txt', contents: 'content-b' },
        { path: 'c.txt', contents: 'content-c' },
      ]);

      vi.advanceTimersByTime(10);

      await Promise.all([singlePromise, batchPromise]);

      // All should be in a single batch call
      expect(adapter.writeTextFiles).toHaveBeenCalledTimes(1);
      expect(adapter.writeTextFiles).toHaveBeenCalledWith(
        [
          { path: 'a.txt', contents: 'content-a' },
          { path: 'b.txt', contents: 'content-b' },
          { path: 'c.txt', contents: 'content-c' },
        ],
        undefined,
      );
    });
  });

  describe('read-after-write consistency', () => {
    it('returns pending write contents for a read to the same path', async () => {
      const adapter = createMockAdapter({
        'a.txt': 'old-content',
      });
      const queue = new IoQueue(adapter);

      // Queue a write
      queue.write('a.txt', 'new-content');

      // Read the same path before the write flushes
      const result = await queue.read('a.txt');

      // Should return the pending write contents, not the
      // adapter's stale value
      expect(result).toBe('new-content');

      // The read should not have triggered a readTextFiles call
      expect(adapter.readTextFiles).not.toHaveBeenCalled();
    });

    it('does not match paths with different options', async () => {
      const adapter = createMockAdapter({
        'config.json': 'from-adapter',
      });
      const queue = new IoQueue(adapter);

      // Queue a write with baseDir
      queue.write('config.json', 'new-config', {
        baseDir: BaseDirectory.AppData,
      });

      // Read the same path WITHOUT baseDir (different effective file)
      const promise = queue.read('config.json');

      vi.advanceTimersByTime(10);

      const result = await promise;

      // Should read from the adapter, not the pending write
      expect(result).toBe('from-adapter');
      expect(adapter.readTextFiles).toHaveBeenCalledTimes(1);
    });
  });
});
