import { InstanceView, StaticView } from './View.types';

export type StaticViewConfig = Omit<StaticView, 'extension'>;
export type InstanceViewConfig = Omit<InstanceView, 'extension'>;

export type ViewConfig = StaticViewConfig | InstanceViewConfig;
