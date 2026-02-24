import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';

export type CollapsibleProps = CollapsiblePrimitive.Root.Props;
export type CollapsibleTriggerProps = CollapsiblePrimitive.Trigger.Props;
export type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props;

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = CollapsiblePrimitive.Panel;
