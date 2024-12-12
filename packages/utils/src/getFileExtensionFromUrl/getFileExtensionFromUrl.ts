/**
 * Extracts the file extension from an image URL, ignoring any query parameters.
 *
 * @param url - The file URL.
 * @returns The file extension (e.g., 'jpg', 'png') or `null` if none found.
 */
export function getFileExtensionFromUrl(url: string): string | null {
  try {
    // Parse the URL to remove query parameters
    const urlWithoutQuery = new URL(url).pathname;

    // Split the path into parts by the '/' character
    const parts = urlWithoutQuery.split('/');

    // Get the last part of the path (the file name)
    const fileName = parts[parts.length - 1];

    // Find the last '.' in the file name to get the extension
    const dotIndex = fileName.lastIndexOf('.');

    // Ensure the '.' exists and is not at the start or end of the file name
    if (dotIndex > 0 && dotIndex < fileName.length - 1) {
      return fileName.substring(dotIndex + 1).toLowerCase();
    }

    // No extension found
    return null;
  } catch (error) {
    console.warn('Error parsing file extension from URL:', error);

    return null;
  }
}
