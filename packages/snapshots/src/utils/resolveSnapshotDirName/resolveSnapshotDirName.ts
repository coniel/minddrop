/**
 * Returns the directory name under which a snapshot captured at the
 * given time is stored.
 *
 * Names are UTC at second precision, which is coarser than the idle
 * gap between captures of a subject, and drop the time separators,
 * which are not valid in file names on all platforms.
 *
 * @param capturedAt - The time at which the snapshot was captured.
 * @returns The snapshot directory name.
 */
export function resolveSnapshotDirName(capturedAt: Date): string {
  return capturedAt
    .toISOString()
    .replace(/\.\d+Z$/, 'Z')
    .replace(/:/g, '');
}
