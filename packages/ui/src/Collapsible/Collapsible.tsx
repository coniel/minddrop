import * as CollapsiblePrimitives from '@radix-ui/react-collapsible';
import React from 'react';

export type CollapsibleProps = CollapsiblePrimitives.CollapsibleProps;
export type CollapsibleTriggerProps =
  CollapsiblePrimitives.CollapsibleTriggerProps;
export type CollapsibleContentProps =
  CollapsiblePrimitives.CollapsibleContentProps;

export const Collapsible = CollapsiblePrimitives.Root;
export const CollapsibleContent = CollapsiblePrimitives.Content;

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  children,
  ...other
}) => (
  <CollapsiblePrimitives.Trigger asChild {...other}>
    {children}
  </CollapsiblePrimitives.Trigger>
);
