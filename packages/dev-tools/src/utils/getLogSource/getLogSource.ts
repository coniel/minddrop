import { DevToolsLogSource } from '../../types';

// Matches a file name with extension, optionally followed by a bundler
// query string, then ":line:column". Covers both the V8 ("at fn (path)")
// and WebKit ("fn@path") stack formats. The file name stops at the
// characters which separate it from the rest of the frame, so that a
// frame without a directory path does not swallow the function name.
const SourceLocationPattern =
  /([^/\\?\s()@:]+\.[a-z0-9]+)(?:\?[^:]*)?:(\d+):\d+/i;

/**
 * Extracts the file and line a console call was made from out of
 * its call stack.
 *
 * @param stack - The stack trace captured at the console call.
 * @param ignorePattern - Frames matching this are skipped, so that the
 *   capturing code does not report itself as the source.
 * @returns The source location, or null when the stack has none.
 */
export function getLogSource(
  stack: string | undefined,
  ignorePattern: RegExp,
): DevToolsLogSource | null {
  // Stack traces are unavailable in some environments
  if (!stack) {
    return null;
  }

  for (const frame of stack.split('\n')) {
    // Skip the capturing code and third party frames
    if (ignorePattern.test(frame) || frame.includes('node_modules')) {
      continue;
    }

    const match = frame.match(SourceLocationPattern);

    if (match) {
      return { file: match[1], line: parseInt(match[2], 10) };
    }
  }

  return null;
}
