import { DesignType } from '../types';
import { CardDesignTemplate } from './CardDesignTemplate';
import { ListDesignTemplate } from './ListDesignTemplate';
import { PageDesignTemplate } from './PageDesignTemplate';

export * from './CardDesignTemplate';
export * from './ListDesignTemplate';
export * from './PageDesignTemplate';

export type DesignTemplate =
  | CardDesignTemplate
  | ListDesignTemplate
  | PageDesignTemplate;

export const DesignTemplates: Record<DesignType, DesignTemplate> = {
  card: CardDesignTemplate,
  list: ListDesignTemplate,
  page: PageDesignTemplate,
};
