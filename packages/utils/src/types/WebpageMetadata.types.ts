export interface WebpageMetadata {
  /**
   * The website domain.
   */
  domain: string;

  /**
   * The webpage title or domain if a title
   * is not present.
   */
  title: string;

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
   * The webpage meta description.
   */
  description?: string;

  /**
   * The webpage meta keywords.
   */
  keywords?: string[];
}
