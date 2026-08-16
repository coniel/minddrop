import { Events } from '@minddrop/events';
import { Fs } from '../FileSystem';
import { FileSystemChangedEvent, FileSystemChangedEventData } from '../events';
import { FileSystemChangeKind, FsWatchEventKind } from '../types';
import { hasWrittenContents, matchesWrittenContents } from '../writeRegistry';

// How long to wait for a path to stop changing before dispatching
// an event for it. Editors write a file several times per save.
const DebounceMs = 200;

// File names which never carry app state
const IgnoredFileNames = ['.DS_Store', 'Thumbs.db'];

// Suffixes of the temporary files editors write beside the real one
const IgnoredFileSuffixes = ['.tmp', '~'];

interface PendingChange {
  /**
   * The adapter event kinds seen for the path so far.
   */
  kinds: Set<FsWatchEventKind>;

  /**
   * The debounce timer, restarted by each new event for the path.
   */
  timer: ReturnType<typeof setTimeout>;
}

/**
 * Watches the given directories recursively, dispatching a file
 * system changed event for each path changed outside of the app.
 * Events are debounced and coalesced per path.
 *
 * @param paths - The directory paths to watch.
 * @returns A function that stops the watcher.
 *
 * @dispatches file-system:changed
 */
export async function startFileSystemWatcher(
  paths: string[],
): Promise<VoidFunction> {
  // Changes awaiting the end of their debounce window, keyed by path
  const pendingChanges = new Map<string, PendingChange>();

  // Watch the paths, funnelling every event through the debounce
  const watcherId = await Fs.watch(
    paths,
    (event) => {
      event.paths.forEach((path) => {
        if (isIgnoredPath(path)) {
          return;
        }

        queueChange(pendingChanges, path, event.kind);
      });
    },
    { recursive: true },
  );

  // Stop the watcher and drop any changes still being debounced
  return () => {
    pendingChanges.forEach((change) => clearTimeout(change.timer));
    pendingChanges.clear();

    Fs.unwatch(watcherId);
  };
}

/**
 * Adds an event kind to a path's pending change and restarts its
 * debounce timer.
 */
function queueChange(
  pendingChanges: Map<string, PendingChange>,
  path: string,
  kind: FsWatchEventKind,
): void {
  const pending = pendingChanges.get(path);

  // Restart the debounce on an existing pending change
  if (pending) {
    clearTimeout(pending.timer);

    pending.kinds.add(kind);
    pending.timer = setTimeout(
      () => flushChange(pendingChanges, path),
      DebounceMs,
    );

    return;
  }

  // Otherwise start a new pending change for the path
  pendingChanges.set(path, {
    kinds: new Set([kind]),
    timer: setTimeout(() => flushChange(pendingChanges, path), DebounceMs),
  });
}

/**
 * Dispatches the pending change for a path once its debounce
 * window has elapsed.
 */
async function flushChange(
  pendingChanges: Map<string, PendingChange>,
  path: string,
): Promise<void> {
  const pending = pendingChanges.get(path);

  if (!pending) {
    return;
  }

  pendingChanges.delete(path);

  // A queued write means the app's state is ahead of disk and
  // that write is about to land, so the change is not applied
  if (Fs.hasPendingWrite(path)) {
    return;
  }

  const exists = await Fs.exists(path);

  // A path that no longer exists was deleted, whatever the
  // adapter reported along the way
  if (!exists) {
    dispatchChange(path, 'deleted');

    return;
  }

  // The app's own writes leave its state already current, so an
  // event for one would only ask a package to re-read what it holds
  if (await isSelfWrite(path)) {
    return;
  }

  const kind: FileSystemChangeKind = pending.kinds.has('create')
    ? 'created'
    : 'modified';

  dispatchChange(path, kind);
}

/**
 * Checks whether a path's current contents are the ones the app
 * last wrote to it.
 */
async function isSelfWrite(path: string): Promise<boolean> {
  // Paths the app has never written to are external by definition,
  // so the common case costs no read
  if (!hasWrittenContents(path)) {
    return false;
  }

  try {
    const contents = await Fs.readTextFile(path);

    return matchesWrittenContents(path, contents);
  } catch {
    // Unreadable as text (a binary file, or deleted mid-flight).
    // Reporting the change is the recoverable direction.
    return false;
  }
}

/**
 * Dispatches a file system changed event.
 */
function dispatchChange(path: string, kind: FileSystemChangeKind): void {
  Events.dispatch<FileSystemChangedEventData>(FileSystemChangedEvent, {
    path,
    kind,
  });
}

/**
 * Checks whether a path is one of the files that never carry app
 * state, such as OS metadata and editor temp files.
 */
function isIgnoredPath(path: string): boolean {
  const fileName = Fs.fileNameFromPath(path);

  if (IgnoredFileNames.includes(fileName)) {
    return true;
  }

  return IgnoredFileSuffixes.some((suffix) => fileName.endsWith(suffix));
}
