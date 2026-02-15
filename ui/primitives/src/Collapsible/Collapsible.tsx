import { Collapsible as CollapsiblePrimitives } from '@base-ui/react/collapsible';
import React from 'react';

export type CollapsibleProps = CollapsiblePrimitives.Root.Props;
export type CollapsibleTriggerProps = CollapsiblePrimitives.Trigger.Props;
export type CollapsibleContentProps = CollapsiblePrimitives.Panel.Props;

export const Collapsible = CollapsiblePrimitives.Root;
export const CollapsibleContent = CollapsiblePrimitives.Panel;

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  ...other
}) => (
  <CollapsiblePrimitives.Trigger {...other}>
    {children}
  </CollapsiblePrimitives.Trigger>
);
