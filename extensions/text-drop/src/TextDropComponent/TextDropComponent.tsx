import React, { FC, useState } from 'react';
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
  const [draggable, setDraggable] = useState(true);

  return (
    <Drop
      draggable={draggable}
      color={color}
      selected={selected}
      className="text-drop"
      onDragStart={onDragStart}
    >
      <RichTextEditor
        documentId={richTextDocument}
        onFocus={() => {
          setDraggable(false);
        }}
        onBlur={() => {
          setDraggable(true);
        }}
      />
      <div className="drag-handle" onMouseDown={onClick} />
      <DropActions dropId={id} currentParent={currentParent} />
    </Drop>
  );
};
