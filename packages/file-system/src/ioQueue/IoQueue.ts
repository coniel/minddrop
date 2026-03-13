import {
  FileSystemAdapter,
  FsReadFileOptions,
  FsWriteFileOptions,
} from '../types';

interface ReadCaller {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}

interface ReadPending {
  /** The original path as passed by the caller */
  path: string;
  options?: FsReadFileOptions;
  callers: ReadCaller[];
}

interface WriteCaller {
  resolve: () => void;
  reject: (reason: unknown) => void;
}

interface WritePending {
  /** The original path as passed by the caller */
  path: string;
  options?: FsWriteFileOptions;
  contents: string;
  callers: WriteCaller[];
}

// Debounce window in milliseconds for batching I/O operations
const DEBOUNCE_MS = 10;

/**
 * Creates a composite key from a path and options so that
 * the same relative path with different baseDirs is treated
 * as a separate entry.
 */
function compositeKey(
  path: string,
  options?: FsReadFileOptions | FsWriteFileOptions,
): string {
  if (options?.baseDir) {
    return `${options.baseDir}:${path}`;
  }

  return path;
}

/**
 * Batches concurrent file system read and write operations into
 * single adapter calls, reducing RPC round-trips. Single-file and
 * batch calls feed into the same pending sets.
 */
export class IoQueue {
  private adapter: FileSystemAdapter;

  // Pending reads keyed by composite key (baseDir:path)
  private pendingReads: Map<string, ReadPending> = new Map();
  private readTimer: ReturnType<typeof setTimeout> | null = null;

  // Pending writes keyed by composite key (baseDir:path)
  private pendingWrites: Map<string, WritePending> = new Map();
  private writeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(adapter: FileSystemAdapter) {
    this.adapter = adapter;
  }

  /**
   * Queues a single file read. The read is batched with other
   * concurrent reads and flushed after the debounce window.
   *
   * @param path - The file path.
   * @param options - Read file options.
   * @returns A promise resolving to the file contents.
   */
  read(path: string, options?: FsReadFileOptions): Promise<string> {
    const key = compositeKey(path, options);

    // If there is a pending write for this path, return the
    // pending contents immediately for read-after-write consistency
    const pendingWrite = this.pendingWrites.get(key);

    if (pendingWrite) {
      return Promise.resolve(pendingWrite.contents);
    }

    return new Promise<string>((resolve, reject) => {
      // Add to pending, deduplicating by composite key
      const existing = this.pendingReads.get(key);

      if (existing) {
        existing.callers.push({ resolve, reject });
      } else {
        this.pendingReads.set(key, {
          path,
          options,
          callers: [{ resolve, reject }],
        });
      }

      // Reset the debounce timer
      this.resetReadTimer();
    });
  }

  /**
   * Queues multiple file reads. The paths merge into the same
   * pending set as single `read` calls and flush together.
   *
   * @param paths - The file paths to read.
   * @param options - Read file options shared by all paths.
   * @returns A promise resolving to a map of path to file contents.
   */
  readMany(
    paths: string[],
    options?: FsReadFileOptions,
  ): Promise<Map<string, string>> {
    // Create individual read promises for each path
    const entries = paths.map(
      (path) => [path, this.read(path, options)] as const,
    );

    // Collect results into a map, skipping paths that failed
    return Promise.allSettled(entries.map(([, promise]) => promise)).then(
      (results) => {
        const resultMap = new Map<string, string>();

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            resultMap.set(entries[index][0], result.value);
          }
        });

        return resultMap;
      },
    );
  }

  /**
   * Queues a single file write. If the same path is written
   * multiple times before the flush, only the last write is
   * kept. Earlier callers resolve immediately as no-ops.
   *
   * @param path - The file path.
   * @param contents - The file contents.
   * @param options - Write file options.
   * @returns A promise that resolves when the write completes.
   */
  write(
    path: string,
    contents: string,
    options?: FsWriteFileOptions,
  ): Promise<void> {
    const key = compositeKey(path, options);

    return new Promise<void>((resolve, reject) => {
      const existing = this.pendingWrites.get(key);

      if (existing) {
        // Resolve previous callers immediately since their
        // write will be superseded by this one
        existing.callers.forEach((caller) => caller.resolve());
        existing.contents = contents;
        existing.callers = [{ resolve, reject }];
      } else {
        this.pendingWrites.set(key, {
          path,
          options,
          contents,
          callers: [{ resolve, reject }],
        });
      }

      // Reset the debounce timer
      this.resetWriteTimer();
    });
  }

  /**
   * Queues multiple file writes. The entries merge into the same
   * pending set as single `write` calls and flush together.
   *
   * @param entries - The files to write, each with a path and contents.
   * @param options - Write file options shared by all entries.
   * @returns A promise that resolves when all writes complete.
   */
  writeMany(
    entries: { path: string; contents: string }[],
    options?: FsWriteFileOptions,
  ): Promise<void> {
    return Promise.all(
      entries.map((entry) => this.write(entry.path, entry.contents, options)),
    ).then(() => undefined);
  }

  /**
   * Resets the read debounce timer. When it fires, all pending
   * reads are flushed in a single adapter call.
   */
  private resetReadTimer(): void {
    if (this.readTimer !== null) {
      clearTimeout(this.readTimer);
    }

    this.readTimer = setTimeout(() => {
      this.readTimer = null;
      this.flushReads();
    }, DEBOUNCE_MS);
  }

  /**
   * Resets the write debounce timer. When it fires, all pending
   * writes are flushed in a single adapter call.
   */
  private resetWriteTimer(): void {
    if (this.writeTimer !== null) {
      clearTimeout(this.writeTimer);
    }

    this.writeTimer = setTimeout(() => {
      this.writeTimer = null;
      this.flushWrites();
    }, DEBOUNCE_MS);
  }

  /**
   * Flushes all pending reads. Entries are grouped by options
   * so that each group is sent as a single `readTextFiles` call.
   */
  private flushReads(): void {
    const batch = new Map(this.pendingReads);
    this.pendingReads.clear();

    // Group entries by serialized options
    const groups = new Map<
      string,
      {
        options?: FsReadFileOptions;
        entries: Map<string, ReadPending>;
      }
    >();

    for (const [key, pending] of batch) {
      const groupKey = pending.options?.baseDir ?? '';
      let group = groups.get(groupKey);

      if (!group) {
        group = { options: pending.options, entries: new Map() };
        groups.set(groupKey, group);
      }

      group.entries.set(key, pending);
    }

    // Flush each group as a separate batch call
    for (const [, { options, entries }] of groups) {
      const paths = [...entries.values()].map((entry) => entry.path);

      this.adapter.readTextFiles(paths, options).then(
        (results) => {
          for (const [, pending] of entries) {
            const content = results.get(pending.path);

            if (content !== undefined) {
              pending.callers.forEach((caller) => caller.resolve(content));
            } else {
              const error = new Error(`Failed to read file: ${pending.path}`);
              pending.callers.forEach((caller) => caller.reject(error));
            }
          }
        },
        (error) => {
          // If the entire batch call fails, reject all callers
          for (const [, pending] of entries) {
            pending.callers.forEach((caller) => caller.reject(error));
          }
        },
      );
    }
  }

  /**
   * Flushes all pending writes. Entries are grouped by options
   * so that each group is sent as a single `writeTextFiles` call.
   */
  private flushWrites(): void {
    const batch = new Map(this.pendingWrites);
    this.pendingWrites.clear();

    // Group entries by serialized options
    const groups = new Map<
      string,
      {
        options?: FsWriteFileOptions;
        entries: Map<string, WritePending>;
      }
    >();

    for (const [key, pending] of batch) {
      const groupKey = pending.options?.baseDir ?? '';
      let group = groups.get(groupKey);

      if (!group) {
        group = { options: pending.options, entries: new Map() };
        groups.set(groupKey, group);
      }

      group.entries.set(key, pending);
    }

    // Flush each group as a separate batch call
    for (const [, { options, entries }] of groups) {
      const writeEntries = [...entries.values()].map((entry) => ({
        path: entry.path,
        contents: entry.contents,
      }));

      this.adapter.writeTextFiles(writeEntries, options).then(
        () => {
          for (const [, pending] of entries) {
            pending.callers.forEach((caller) => caller.resolve());
          }
        },
        (error) => {
          for (const [, pending] of entries) {
            pending.callers.forEach((caller) => caller.reject(error));
          }
        },
      );
    }
  }
}
