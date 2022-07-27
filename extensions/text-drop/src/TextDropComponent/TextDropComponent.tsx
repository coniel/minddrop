import React, { FC } from 'react';
import { Drop } from '@minddrop/ui';
import {
  SelectionItem,
  useDraggable,
  useSelectable,
} from '@minddrop/selection';
import { DropActions } from '@minddrop/app-ui';
import { RichTextEditor } from '@minddrop/rich-text-editor';
import { DropComponentProps } from '@minddrop/drops';
import { TextDrop } from '../types';
import './TextDropComponent.css';

export interface TextDropComponentProps
  extends Omit<DropComponentProps, 'richTextDocument'>,
    TextDrop {}

export const TextDropComponent: FC<TextDropComponentProps> = ({
  richTextDocument,
  id,
  color,
  currentParent,
  resource,
}) => {
  const selectionItem: SelectionItem = { id, resource, parent: currentParent };
  // Drag and drop handling
  const { onDragStart } = useDraggable(selectionItem);
  // Selection handling
  const { selected, onClick } = useSelectable(selectionItem);

  return (
    <Drop
      draggable
      color={color}
      selected={selected}
      onDragStart={onDragStart}
      className="text-drop"
    >
      <RichTextEditor documentId={richTextDocument} />
      <div className="drag-handle" onClick={onClick} />
      <DropActions dropId={id} currentParent={currentParent} />
    </Drop>
  );
};
