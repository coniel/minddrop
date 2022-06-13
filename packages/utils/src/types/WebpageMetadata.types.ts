export interface WebpageMetadata {
  /**
   * The resource type.
   */
  type?: string;

  /**
   * The website's favicon.
   */
  icon?: string;

  /**
   * The webpage's preview/thumbnail image.
   */
  image?: string;

  /**
   * The webpage title, if it has one.
   */
  title?: string;

  /**
   * The webpage meta description.
   */
  description?: string;

  /**
   * The webpage meta keywords.
   */
  keywords?: string[];
}
