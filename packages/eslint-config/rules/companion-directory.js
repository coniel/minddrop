import fs from 'node:fs';
import path from 'node:path';

// Suffixes marking a sibling as a companion of the linted file
const CompanionSuffixes = ['.test.ts', '.test.tsx', '.stories.tsx', '.css'];

/**
 * Requires a file and its companions (tests, stories, CSS) to be
 * wrapped together in a directory named after the file, and a file
 * without companions to sit unwrapped in its parent directory.
 *
 * @type {import("eslint").Rule.RuleModule}
 */
export const companionDirectory = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require companion files to share a directory named after their file, and solo files to sit unwrapped',
    },
    schema: [],
    messages: {
      soloDirectory:
        'A file wrapped in its own directory needs companion files. Add them or unwrap the file into the parent directory.',
      missingDirectory:
        'A file with companion files is wrapped with them in a directory named after it, with a barrel index.ts.',
    },
  },

  create(context) {
    const filename = context.filename;

    // Skip virtual files, barrels and declaration files
    if (
      !path.isAbsolute(filename) ||
      /^index\.tsx?$/.test(path.basename(filename)) ||
      filename.endsWith('.d.ts')
    ) {
      return {};
    }

    const base = path.basename(filename, path.extname(filename));
    const dirPath = path.dirname(filename);
    const dirName = path.basename(dirPath);

    /**
     * Reads the linted file's sibling file names, empty when the
     * directory cannot be read.
     */
    function readSiblings() {
      try {
        return fs
          .readdirSync(dirPath, { withFileTypes: true })
          .filter((entry) => entry.isFile())
          .map((entry) => entry.name)
          .filter((name) => name !== path.basename(filename));
      } catch {
        return [];
      }
    }

    /**
     * Checks whether a sibling is a companion of the linted file.
     */
    function isCompanion(name) {
      return CompanionSuffixes.some((suffix) => name === base + suffix);
    }

    return {
      Program(node) {
        const siblings = readSiblings();

        // Check if the file is wrapped in its own directory. If so,
        // something besides the barrel has to justify the wrap.
        if (dirName === base) {
          const companions = siblings.filter((name) => name !== 'index.ts');

          if (companions.length === 0) {
            context.report({ node, messageId: 'soloDirectory' });
          }

          return;
        }

        // Companions next to an unwrapped file belong in a shared
        // directory named after it
        if (siblings.some(isCompanion)) {
          context.report({ node, messageId: 'missingDirectory' });
        }
      },
    };
  },
};
