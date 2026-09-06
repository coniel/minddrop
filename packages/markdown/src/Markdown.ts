import { FrontmatterParseError } from './errors';

export const errors = {
  FrontmatterParse: FrontmatterParseError,
};

export { getMarkdownContent as getContent } from './getMarkdownContent';
export { getPropertiesFromMarkdown as getProperties } from './getPropertiesFromMarkdown';
export { setPropertiesOnMarkdown as setProperties } from './setPropertiesOnMarkdown';
