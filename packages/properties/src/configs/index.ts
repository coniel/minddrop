import { PropertyType, PropertyTypeConfig } from '../types';
import { CreatedPropertyTypeConfig } from './CreatedPropertyTypeConfig';
import { DatePropertyTypeConfig } from './DatePropertyTypeConfig';
import { IconPropertyTypeConfig } from './IconPropertyTypeConfig';
import { ImagePropertyTypeConfig } from './ImagePropertyTypeConfig';
import { LastModifiedPropertyTypeConfig } from './LastModifiedPropertyTypeConfig';
import { MarkdownPropertyTypeConfig } from './MarkdownPropertyTypeConfig';
import { NumberPropertyTypeConfig } from './NumberPropertyTypeConfig';
import { SelectPropertyTypeConfig } from './SelectPropertyTypeConfig';
import { TextPropertyTypeConfig } from './TextPropertyTypeConfig';
import { TogglePropertyTypeConfig } from './TogglePropertyTypeConfig';
import { UrlPropertyTypeConfig } from './UrlPropertyTypeConfig';

export * from './CreatedPropertyTypeConfig';
export * from './DatePropertyTypeConfig';
export * from './IconPropertyTypeConfig';
export * from './ImagePropertyTypeConfig';
export * from './LastModifiedPropertyTypeConfig';
export * from './MarkdownPropertyTypeConfig';
export * from './NumberPropertyTypeConfig';
export * from './SelectPropertyTypeConfig';
export * from './TextPropertyTypeConfig';
export * from './TogglePropertyTypeConfig';
export * from './UrlPropertyTypeConfig';

export const PropertyTypeConfigs: Record<PropertyType, PropertyTypeConfig> = {
  text: TextPropertyTypeConfig,
  markdown: MarkdownPropertyTypeConfig,
  number: NumberPropertyTypeConfig,
  date: DatePropertyTypeConfig,
  toggle: TogglePropertyTypeConfig,
  select: SelectPropertyTypeConfig,
  image: ImagePropertyTypeConfig,
  icon: IconPropertyTypeConfig,
  url: UrlPropertyTypeConfig,
  created: CreatedPropertyTypeConfig,
  'last-modified': LastModifiedPropertyTypeConfig,
};
