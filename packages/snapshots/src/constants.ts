export const RenamesDirName = 'renames';
export const RenameEventFileExtension = 'json';
export const HistoryDirName = 'history';
export const SnapshotManifestFileName = 'snapshot.json';

// How long a subject must go uncaptured before the next write to it
// captures again, so that a burst of writes costs one capture at its
// start rather than one per write
export const IdleGapMs = 5 * 60 * 1000;

// Size thresholds which stretch the idle gap for large subjects,
// ordered largest first
export const IdleGapSizeBands = [
  { minBytes: 10_000_000, multiplier: 12 },
  { minBytes: 1_000_000, multiplier: 4 },
];
