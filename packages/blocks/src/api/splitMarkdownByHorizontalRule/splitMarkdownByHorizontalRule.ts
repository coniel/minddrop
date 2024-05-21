interface SplitMarkdownResult {
  content: string;
  horizontalRule: string;
}

/**
 * Splits the given Markdown text into segments based on horizontal rules.
 *
 * The function identifies horizontal rules and splits the text at each rule,
 * creating an array of objects. Each object contains the content before the
 * horizontal rule and the characters used to create the rule.
 *
 * @param markdown The Markdown text to be split.
 * @returns An array of objects with 'content' and 'horizontalRule' properties.
 */
export function splitMarkdownByHorizontalRule(
  markdown: string,
): SplitMarkdownResult[] {
  // Regular expression to match horizontal rules
  const horizontalRulePattern =
    /(^|\n)( {0,3}[-*]){3,}( {0,3}[-*])* *(?:\n|$)/g;

  const results: SplitMarkdownResult[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Iterate through the markdown string, finding each horizontal rule match
  // and capturing the content before it along with the rule itself.
  while ((match = horizontalRulePattern.exec(markdown)) !== null) {
    const endIndex = match.index;
    const rule = match[0].trim();

    results.push({
      content: markdown.substring(lastIndex, endIndex).trim(),
      horizontalRule: rule,
    });

    lastIndex = horizontalRulePattern.lastIndex;
  }

  // Add the remaining content after the last horizontal rule
  if (lastIndex < markdown.length) {
    results.push({
      content: markdown.substring(lastIndex).trim(),
      horizontalRule: '',
    });
  }

  return results;
}
