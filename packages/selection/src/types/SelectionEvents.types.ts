import { EventListenerCallback } from '@minddrop/core';
import React from 'react';
import { SelectionItem } from './SelectionItem.types';

export type SelectionAddEvent = 'selection:items:add';
export type SelectionRemoveEvent = 'selection:items:remove';
export type SelectionDragStartEvent = 'selection:drag:start';
export type SelectionDragEndEvent = 'selection:drag:end';
export type SelectionCopyEvent = 'selection:clipboard:copy';
export type SelectionCutEvent = 'selection:clipboard:cut';

export type SelectionAddEventData = SelectionItem[];
export type SelectionRemoveEventData = SelectionItem[];

export interface SelectionDragEventData {
  /**
   * The actual drag event from the UI component
   * which triggered the call.
   */
  event: DragEvent | React.DragEvent;

  /**
   * The selection items being dragged.
   */
  selection: SelectionItem[];
}

export interface SelectionClipboardEventData {
  /**
   * The actual clipboard event from the UI component
   * which triggered the call.
   */
  event: DragEvent | React.DragEvent;

  /**
   * The selection items being copied/cut.
   */
  selection: SelectionItem[];
}

export type SelectionAddEventCallback = EventListenerCallback<
  SelectionAddEvent,
  SelectionAddEventData
>;
export type SelectionRemoveEventCallback = EventListenerCallback<
  SelectionRemoveEvent,
  SelectionRemoveEventData
>;
export type SelectionDragStartEventCallback = EventListenerCallback<
  SelectionDragStartEvent,
  SelectionDragEventData
>;
export type SelectionDragEndEventCallback = EventListenerCallback<
  SelectionDragEndEvent,
  SelectionDragEventData
>;
export type SelectionCopyEventCallback = EventListenerCallback<
  SelectionCopyEvent,
  SelectionClipboardEventData
>;
export type SelectionCutEventCallback = EventListenerCallback<
  SelectionCutEvent,
  SelectionClipboardEventData
>;
