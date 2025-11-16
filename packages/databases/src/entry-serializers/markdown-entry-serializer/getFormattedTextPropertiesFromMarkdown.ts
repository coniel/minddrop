/**
 * Splits a markdown document into formatted text properties based on the given
 * property names.
 *
 * @param markdown - The markdown document.
 * @param properties - The names of the properties to split the document by.
 * @returns A properties map.
 */
export function getFormattedTextPropertiesFromMarkdown(
  markdown: string,
  properties: string[],
): Record<string, string> {
  const result: Record<string, string> = {};

  // Create a set of header texts (without the ## prefix) for easy lookup
  const headerSet = new Set(
    properties.map((h) => h.replace(/^##\s*/, '').trim()),
  );

  // Split by all ## headers
  const lines = markdown.split('\n');
  let currentHeader: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if this line is a ## header
    const headerMatch = line.match(/^##\s+(.+)$/);

    if (headerMatch) {
      const headerText = headerMatch[1].trim();

      // If we were collecting content for a valid header, save it
      if (currentHeader !== null) {
        result[currentHeader] = currentContent.join('\n').trim();
      }

      // Check if this is one of the headers we're looking for
      if (headerSet.has(headerText)) {
        currentHeader = headerText;
        currentContent = [];
      } else {
        // This header should be part of the previous section's content
        if (currentHeader !== null) {
          currentContent.push(line);
        }
        // If no current header, we just skip this content
      }
    } else {
      // Regular content line
      if (currentHeader !== null) {
        currentContent.push(line);
      }
    }
  }

  // Save the last header's content
  if (currentHeader !== null) {
    result[currentHeader] = currentContent.join('\n').trim();
  }

  // Add empty values for any headings that were not found
  for (const heading of properties) {
    if (!result[heading]) {
      result[heading] = '';
    }
  }

  return result;
}
