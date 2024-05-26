import { InlineElementConfig } from './InlineElementConfig.types';
import { BlockElementConfig } from './BlockElementConfig.types';
import { BlockElementTypeData } from './BlockElement.types';
import { InlineElementTypeData } from './InlineElement.types';

export type ElementConfig<
  TData extends BlockElementTypeData | InlineElementTypeData = {},
> = InlineElementConfig<TData> | BlockElementConfig<TData>;
