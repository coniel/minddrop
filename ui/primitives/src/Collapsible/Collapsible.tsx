import { Collapsible as CollapsiblePrimitives } from '@base-ui/react/collapsible';

export type CollapsibleProps = CollapsiblePrimitives.Root.Props;
export type CollapsibleTriggerProps = CollapsiblePrimitives.Trigger.Props;
export type CollapsibleContentProps = CollapsiblePrimitives.Panel.Props;

export const Collapsible = CollapsiblePrimitives.Root;
export const CollapsibleContent = CollapsiblePrimitives.Panel;
export const CollapsibleTrigger = CollapsiblePrimitives.Trigger;
