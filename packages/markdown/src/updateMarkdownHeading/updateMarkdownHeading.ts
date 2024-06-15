/**
 * Updates the heading of a markdown document.
 *
 * @param markdown - The markdown document.
 * @param heading - The new heading text.
 * @returns The updated markdown document.
 */
export function updateMarkdownHeading(
  markdown: string,
  heading: string,
): string {
  // Split the markdown into lines
  const lines = markdown.split('\n');

  // If the first line is a heading, update it
  if (lines[0].startsWith('# ')) {
    lines[0] = `# ${heading}`;
  }

  // Join the lines back together
  return lines.join('\n');
}
