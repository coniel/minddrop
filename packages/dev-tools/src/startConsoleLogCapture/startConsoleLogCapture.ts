import { addDevToolsLog } from '../addDevToolsLog';
import { DevToolsLogLevel } from '../types';
import { getLogSource } from '../utils';

const CapturedLevels: DevToolsLogLevel[] = ['log', 'info', 'warn', 'error'];

// Frames from this module are the capturing code itself rather than
// the location the console call was made from. Matched with the file
// extension so that frames from files merely named after this one are
// still reported as sources.
const CaptureFramePattern = /startConsoleLogCapture\.[jt]sx?/;

/**
 * Captures console calls into the dev tools logs, leaving the
 * original console output in place.
 *
 * @returns A callback which restores the original console methods.
 */
export function startConsoleLogCapture(): VoidFunction {
  const originals = CapturedLevels.map((level) => {
    const original = console[level].bind(console);

    console[level] = (...args: unknown[]) => {
      original(...args);

      addDevToolsLog(
        level,
        args,
        getLogSource(new Error().stack, CaptureFramePattern),
      );
    };

    return { level, original };
  });

  // Restore the console methods captured above
  return () => {
    originals.forEach(({ level, original }) => {
      console[level] = original;
    });
  };
}
