// Comments which carry a directive or a marker rather than prose
const MarkerPattern =
  /^(eslint|@ts-|ts-|prettier-|biome-|istanbul|c8|v8|TODO|FIXME|NOTE|HACK|XXX|@)/;

// Trailing characters which mark a comment as commented-out code
// rather than prose.
const CodePattern = /[;{}()[\],=>:]$/;

/**
 * Requires a full stop at the end of a line comment which runs to
 * more than one line, or to more than one sentence.
 *
 * A single sentence on a single line takes no full stop, and is left
 * alone either way.
 *
 * @type {import("eslint").Rule.RuleModule}
 */
export const multilineCommentPeriod = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require a full stop at the end of multi-line and multi-sentence comments',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingPeriod:
        'A comment spanning several lines or sentences ends with a full stop.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Checks whether a comment is the first thing on its line, as
     * opposed to trailing a statement.
     */
    function startsItsLine(comment) {
      const before = sourceCode.getTokenBefore(comment);

      return !before || before.loc.end.line < comment.loc.start.line;
    }

    /**
     * Checks whether a comment's text is prose, rather than a
     * directive, a marker, a bare identifier or commented-out code.
     */
    function isProse(text) {
      // An empty comment separates blocks rather than saying anything
      if (!text) {
        return false;
      }

      // Directives and markers carry their own formats
      if (MarkerPattern.test(text)) {
        return false;
      }

      // Commented-out code, which prose would not end on
      if (CodePattern.test(text)) {
        return false;
      }

      // A single word is a label or a path rather than a sentence
      return /\s/.test(text);
    }

    /**
     * Reports a comment group which should end with a full stop but
     * does not.
     */
    function checkGroup(group) {
      const texts = group.map((comment) => comment.value.trim());

      // Leave a group alone unless every line of it is prose
      if (!texts.every(isProse)) {
        return;
      }

      const text = texts.join(' ');

      // A sentence ending part way through means there are several
      const multiSentence = /[.!?]\s+\S/.test(text);

      // Single sentences on a single line take no full stop
      if (group.length === 1 && !multiSentence) {
        return;
      }

      // The group already ends with terminal punctuation
      if (/[.!?]$/.test(text)) {
        return;
      }

      const last = group[group.length - 1];

      context.report({
        loc: last.loc,
        messageId: 'missingPeriod',
        fix: (fixer) =>
          fixer.replaceTextRange(
            last.range,
            `//${last.value.replace(/\s+$/, '')}.`,
          ),
      });
    }

    return {
      Program() {
        // Take the line comments which start their own line, the
        // only ones which form prose blocks.
        const comments = sourceCode
          .getAllComments()
          .filter((comment) => comment.type === 'Line')
          .filter(startsItsLine);

        let group = [];

        comments.forEach((comment) => {
          const previous = group[group.length - 1];

          // A comment continues the group when it sits on the next
          // line at the same indentation.
          const continues =
            previous &&
            comment.loc.start.line === previous.loc.end.line + 1 &&
            comment.loc.start.column === previous.loc.start.column;

          if (!continues && group.length) {
            checkGroup(group);
            group = [];
          }

          group.push(comment);
        });

        // Check the group the last comment left open
        if (group.length) {
          checkGroup(group);
        }
      },
    };
  },
};
