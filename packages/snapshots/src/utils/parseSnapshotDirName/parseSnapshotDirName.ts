// A snapshot directory name, such as `2026-09-01T091402Z`
const SnapshotDirNamePattern = /^(\d{4}-\d{2}-\d{2})T(\d{2})(\d{2})(\d{2})Z$/;

/**
 * Parses a snapshot directory name back into the time it was
 * captured at, doubling as the test of whether a directory within a
 * subject's history is a snapshot at all.
 *
 * @param dirName - The directory name to parse.
 * @returns The capture time, or null if the name is not a snapshot directory name.
 */
export function parseSnapshotDirName(dirName: string): Date | null {
  const match = SnapshotDirNamePattern.exec(dirName);

  // Foreign directories, such as one the user created by hand
  if (!match) {
    return null;
  }

  const [, date, hours, minutes, seconds] = match;

  return new Date(`${date}T${hours}:${minutes}:${seconds}Z`);
}
