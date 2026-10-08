import { MockFileDescriptor } from '@minddrop/file-system';
import { Database } from '../../types';
import { resolveEntryMetadataFilePath } from '../../utils';
import { databaseConfigFile } from '../databaseConfigFile';
import {
  databaseDirPath,
  noPropertiesDatabase,
  parentDir,
} from './databases.fixtures';

/**
 * A case of hostile input. The files of a healthy workspace, and the
 * files which break them.
 */
export interface HostileCase {
  /**
   * What breaks the workspace, phrased to follow "a workspace with".
   */
  description: string;

  /**
   * The files as they were when the workspace was healthy.
   */
  healthyFiles: MockFileDescriptor[];

  /**
   * The files written over or beside the healthy ones to break them.
   */
  brokenFiles: MockFileDescriptor[];
}

// A database with the hostile entries
export const database_hostile: Database = {
  ...noPropertiesDatabase,
  id: 'database_hostile',
  name: 'Hostile',
  path: 'Hostile',
  properties: [
    { type: 'content', name: 'Content' },
    { type: 'text', name: 'Summary' },
  ],
};

// A database whose config gets truncated
export const database_truncated: Database = {
  ...noPropertiesDatabase,
  id: 'database_truncated',
  name: 'Truncated',
  path: 'Truncated',
};

// The files every hostile workspace has: the database configs and a
// directory of markdown files. The directory has no hidden directory,
// so it is not a database.
export const hostileWorkspaceFiles: MockFileDescriptor[] = [
  databaseConfigFile(database_hostile),
  databaseConfigFile(database_truncated),
  {
    path: `${parentDir}/No Hidden Dir/Loose.md`,
    textContent: '---\nSummary: Not in a database\n---\n\nLoose body\n',
  },
];

// A healthy entry's contents
const healthyEntry = '---\nSummary: A plain summary\n---\n\nThe body\n';

// A healthy entry's contents as edited on another device
const editedEntry = '---\nSummary: Edited on another device\n---\n\nThe body\n';

// A healthy entry's contents, with a list
const healthyListEntry = '---\nAliases:\n  - One\n  - Two\n---\n\nThe body\n';

// A healthy sidecar's contents
const healthySidecar = JSON.stringify({
  created: '2020-03-03T00:00:00.000Z',
  lastModified: '2020-03-03T00:00:00.000Z',
  color: 'red',
});

// A sidecar left with git conflict markers by a pull
const conflictedSidecar =
  '{\n<<<<<<< HEAD\n  "color": "red",\n=======\n  "color": "blue",\n>>>>>>> origin/main\n  "created": "2020-03-03T00:00:00.000Z",\n  "lastModified": "2020-03-03T00:00:00.000Z"\n}\n';

// A colon in a frontmatter value
export const hostileCase_colonInValue: HostileCase = {
  description: 'a colon in a frontmatter value',
  healthyFiles: [hostileEntryFile('Colon In Value', healthyEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Colon In Value',
      '---\nSummary: Note: this breaks\n---\n\nThe body\n',
    ),
  ],
};

// A badly indented frontmatter list
export const hostileCase_listIndent: HostileCase = {
  description: 'a badly indented frontmatter list',
  healthyFiles: [hostileEntryFile('List Indent', healthyListEntry)],
  brokenFiles: [
    hostileEntryFile(
      'List Indent',
      '---\nAliases:\n  - One\n - Two\n---\n\nThe body\n',
    ),
  ],
};

// An unclosed quote in frontmatter
export const hostileCase_unclosedQuote: HostileCase = {
  description: 'an unclosed quote in frontmatter',
  healthyFiles: [hostileEntryFile('Unclosed Quote', healthyEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Unclosed Quote',
      '---\nSummary: "A plain summary\n---\n\nThe body\n',
    ),
  ],
};

// An unclosed flow sequence in frontmatter
export const hostileCase_unclosedFlowSequence: HostileCase = {
  description: 'an unclosed flow sequence in frontmatter',
  healthyFiles: [hostileEntryFile('Unclosed Flow', healthyListEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Unclosed Flow',
      '---\nAliases: [One, Two\n---\n\nThe body\n',
    ),
  ],
};

// Tab indentation in frontmatter
export const hostileCase_tabIndent: HostileCase = {
  description: 'tab indentation in frontmatter',
  healthyFiles: [hostileEntryFile('Tab Indent', healthyListEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Tab Indent',
      '---\nAliases:\n\t- One\n\t- Two\n---\n\nThe body\n',
    ),
  ],
};

// Binary contents in an entry file
export const hostileCase_binary: HostileCase = {
  description: 'binary contents in an entry file',
  healthyFiles: [hostileEntryFile('Binary', healthyEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Binary',
      '\u0089PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000��',
    ),
  ],
};

// An emptied entry file
export const hostileCase_empty: HostileCase = {
  description: 'an emptied entry file',
  healthyFiles: [hostileEntryFile('Empty', healthyEntry)],
  brokenFiles: [hostileEntryFile('Empty', '')],
};

// An entry file with only frontmatter
export const hostileCase_frontmatterOnly: HostileCase = {
  description: 'an entry file with only frontmatter',
  healthyFiles: [hostileEntryFile('Frontmatter Only', healthyEntry)],
  brokenFiles: [
    hostileEntryFile('Frontmatter Only', '---\nSummary: Only this\n---'),
  ],
};

// Git conflict markers in an entry file
export const hostileCase_entryConflictMarkers: HostileCase = {
  description: 'git conflict markers in an entry file',
  healthyFiles: [hostileEntryFile('Git Conflict', healthyEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Git Conflict',
      '---\n<<<<<<< HEAD\nSummary: Ours\n=======\nSummary: Theirs\n>>>>>>> origin/main\n---\n\nThe body\n',
    ),
  ],
};

// Git conflict markers in a sidecar
export const hostileCase_sidecarConflictMarkers: HostileCase = {
  description: 'git conflict markers in a sidecar',
  healthyFiles: [
    hostileEntryFile('Sidecar Conflict', healthyEntry),
    hostileSidecarFile('Sidecar Conflict', healthySidecar),
  ],
  brokenFiles: [hostileSidecarFile('Sidecar Conflict', conflictedSidecar)],
};

// Git conflict markers in the sidecar of an edited entry
export const hostileCase_sidecarConflictMarkers_editedEntry: HostileCase = {
  description: 'git conflict markers in the sidecar of an edited entry',
  healthyFiles: [
    hostileEntryFile('Edited Sidecar Conflict', healthyEntry),
    hostileSidecarFile('Edited Sidecar Conflict', healthySidecar),
  ],
  brokenFiles: [
    hostileEntryFile(
      'Edited Sidecar Conflict',
      '---\nSummary: Edited in the same pull\n---\n\nThe body\n',
    ),
    hostileSidecarFile('Edited Sidecar Conflict', conflictedSidecar),
  ],
};

// A sync client conflict copy of an entry
export const hostileCase_entryConflictCopy: HostileCase = {
  description: 'a sync client conflict copy of an entry',
  healthyFiles: [hostileEntryFile('Conflict Copy', healthyEntry)],
  brokenFiles: [
    hostileEntryFile(
      'Conflict Copy (conflicted copy)',
      '---\nSummary: The other device\n---\n\nThe body\n',
    ),
  ],
};

// An entry written to under a name differing only in case. A
// case-insensitive file system writes it into the existing entry.
export const hostileCase_caseOnlyNames: HostileCase = {
  description: 'an entry written to under a name differing only in case',
  healthyFiles: [hostileEntryFile('Case', healthyEntry)],
  brokenFiles: [hostileEntryFile('case', editedEntry)],
};

// An entry name with its accented letter composed into one code point
// (NFC).
const composedName = 'Café'.normalize('NFC');
// The same entry name with the accent as a combining mark (NFD)
const decomposedName = 'Café'.normalize('NFD');

// Fail loudly rather than test two identical names
if (composedName === decomposedName) {
  throw new Error('The NFC and NFD entry names must differ.');
}

// An entry written to under a name differing only in unicode
// normalization. A normalization-insensitive file system writes it into
// the existing entry.
export const hostileCase_unicodeNormalization: HostileCase = {
  description:
    'an entry written to under a name differing only in unicode normalization',
  healthyFiles: [hostileEntryFile(composedName, healthyEntry)],
  brokenFiles: [hostileEntryFile(decomposedName, editedEntry)],
};

// A truncated database config
export const hostileCase_truncatedConfig: HostileCase = {
  description: 'a truncated database config',
  healthyFiles: [
    {
      path: `${databaseDirPath(database_truncated)}/Kept.md`,
      textContent: healthyEntry,
    },
  ],
  brokenFiles: [
    {
      ...databaseConfigFile(database_truncated),
      textContent: databaseConfigFile(database_truncated).textContent?.slice(
        0,
        40,
      ),
    },
  ],
};

// Every hostile case
export const hostileCases: HostileCase[] = [
  hostileCase_colonInValue,
  hostileCase_listIndent,
  hostileCase_unclosedQuote,
  hostileCase_unclosedFlowSequence,
  hostileCase_tabIndent,
  hostileCase_binary,
  hostileCase_empty,
  hostileCase_frontmatterOnly,
  hostileCase_entryConflictMarkers,
  hostileCase_sidecarConflictMarkers,
  hostileCase_sidecarConflictMarkers_editedEntry,
  hostileCase_entryConflictCopy,
  hostileCase_caseOnlyNames,
  hostileCase_unicodeNormalization,
  hostileCase_truncatedConfig,
];

/**
 * Returns an entry file in the hostile database.
 *
 * @param title - The entry's title.
 * @param textContent - The entry file's contents.
 * @returns The entry file's path and contents.
 */
function hostileEntryFile(
  title: string,
  textContent: string,
): MockFileDescriptor {
  // Resolve the entry file's path from its title
  return {
    path: `${databaseDirPath(database_hostile)}/${title}.md`,
    textContent,
  };
}

/**
 * Returns the sidecar of an entry in the hostile database.
 *
 * @param title - The entry's title.
 * @param textContent - The sidecar's contents.
 * @returns The sidecar's path and contents.
 */
function hostileSidecarFile(
  title: string,
  textContent: string,
): MockFileDescriptor {
  // Resolve the hostile database's directory path
  const databasePath = databaseDirPath(database_hostile);

  // Resolve the sidecar's path from the entry's file path
  return {
    path: resolveEntryMetadataFilePath(
      databasePath,
      `${databasePath}/${title}.md`,
    ),
    textContent,
  };
}
