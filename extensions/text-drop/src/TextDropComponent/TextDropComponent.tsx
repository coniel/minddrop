import React, { FC } from 'react';
import { Drop } from '@minddrop/ui';
import { useDraggableDrop, useSelectableDrop } from '@minddrop/app';
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
}) => {
  // Drag and drop handling
  const { onDragStart } = useDraggableDrop(id);
  // Selection handling
  const { selectedClass, onClick } = useSelectableDrop(id);

  return (
    <Drop
      draggable
      color={color}
      onDragStart={onDragStart}
      className={`text-drop ${selectedClass}`}
    >
      <RichTextEditor documentId={richTextDocument} />
      <div className="drag-handle" onClick={onClick} />
      <DropActions dropId={id} currentParent={currentParent} />
    </Drop>
  );
};
