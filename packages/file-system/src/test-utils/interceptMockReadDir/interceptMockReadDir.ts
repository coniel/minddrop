import { MockFileSystem } from '../../types';
import { registerMockAdapterOverrides } from '../registerMockAdapterOverrides';

/**
 * Options for intercepting a mock directory listing.
 */
export interface InterceptMockReadDirOptions {
  /**
   * The directory whose listing to intercept.
   */
  path: string;

  /**
   * A directory which must be listed first. When given, only a
   * listing of `path` following a listing of this directory is
   * intercepted.
   */
  afterPath?: string;

  /**
   * Runs once, before the intercepted listing goes ahead.
   */
  onRead: () => Promise<void>;
}

/**
 * An intercepted mock directory listing.
 */
export interface MockReadDirInterception {
  /**
   * Whether `onRead` has run.
   */
  ran: boolean;

  /**
   * Registers the plain mock adapter again.
   */
  restore: VoidFunction;
}

/**
 * Registers the mock file system's adapter with directory listings
 * which run a callback once. The callback runs before the first listing
 * of a given directory.
 *
 * @param mockFileSystem - The mock file system whose listings to intercept.
 * @param options - The directory to intercept and the callback to run.
 * @returns The interception.
 */
export function interceptMockReadDir(
  mockFileSystem: MockFileSystem,
  options: InterceptMockReadDirOptions,
): MockReadDirInterception {
  // Read the options, counting listings straight away without an after
  // path.
  const { path, afterPath, onRead } = options;
  const adapter = mockFileSystem.MockFs;
  let afterPathRead = !afterPath;

  // Override the directory listing
  const interception: MockReadDirInterception = {
    ran: false,
    restore: registerMockAdapterOverrides(mockFileSystem, {
      readDir: async (dirPath, readOptions) => {
        // Run the callback before the first counted listing of the path
        if (!interception.ran && afterPathRead && dirPath === path) {
          interception.ran = true;
          await onRead();
        }

        // Count listings of the path once the after path is listed
        if (dirPath === afterPath) {
          afterPathRead = true;
        }

        // List the directory with the plain adapter
        return adapter.readDir(dirPath, readOptions);
      },
    }),
  };

  return interception;
}
