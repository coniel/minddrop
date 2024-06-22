export interface WebpageMetadata {
  /**
   * The website domain.
   */
  domain: string;

  /**
   * The webdocument title or domain if a title
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
   * The webdocument's preview/thumbnail image.
   */
  image?: string;

  /**
   * The webdocument meta description.
   */
  description?: string;

  /**
   * The webdocument meta keywords.
   */
  keywords?: string[];
}
