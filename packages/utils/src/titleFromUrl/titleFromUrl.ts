export function titleFromUrl(url: string): string {
  // Remove protocol (http://, https://, ftp://, etc.)
  let title = url.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '');

  // Remove trailing slashes
  title = title.replace(/\/+$/, '');

  // Decode URL encoded characters (like %20 for spaces)
  try {
    title = decodeURIComponent(title);
  } catch (e) {
    // If decoding fails, continue with the original string
  }

  // Remove file extensions but preserve TLDs
  // Only remove extension if there's a path separator before it
  title = title.replace(/\/[^\/]*\.[a-zA-Z0-9]+$/, (match) => {
    // Remove the extension from the last segment
    return match.replace(/\.[a-zA-Z0-9]+$/, '');
  });

  // Replace characters that are invalid on Windows, macOS, or Linux
  // Windows: < > : " / \ | ? *
  title = title.replace(/[<>:"|?*\\\/]/g, '_');

  // Replace other problematic characters
  title = title.replace(/[^\w\s\-_.]/g, '_');

  // Collapse multiple underscores into one
  title = title.replace(/_+/g, '_');

  // Collapse multiple spaces into one
  title = title.replace(/\s+/g, ' ');

  // Remove leading/trailing underscores, dots, and spaces
  title = title.replace(/^[_.\s]+|[_.\s]+$/g, '');

  // Handle edge cases
  if (!title) {
    title = 'Untitled';
  }

  // Limit length (Windows has a 255 character limit for filenames)
  if (title.length > 200) {
    title = title.substring(0, 200).trim();
  }

  return title;
}
