import React from 'react';
import * as DialogPrimitives from '@radix-ui/react-dialog';

export type DialogTriggerProps = DialogPrimitives.DialogTriggerProps;

export const DialogTrigger = ({ children }) => (
  <DialogPrimitives.Trigger asChild>{children}</DialogPrimitives.Trigger>
);
