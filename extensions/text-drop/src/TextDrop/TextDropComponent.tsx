import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { generateId } from '@minddrop/utils';
import { Drop } from '@minddrop/ui';
import { useDebouncedCallback } from 'use-debounce';
import { useDraggableDrop, useSelectableDrop } from '@minddrop/app';
import { DropActions } from '@minddrop/app-ui';
import {
  Editor,
  EditorContent,
  ParagraphPlugin,
  TitlePlugin,
} from '@minddrop/rich-text-editor';
import { TextDrop, TextDropUpdateData } from '../types';
import './TextDropComponent.css';
import { DropComponentProps, Drops } from '@minddrop/drops';
import { useCore } from '@minddrop/core';

export interface TextDropComponentProps extends DropComponentProps, TextDrop {}

export const TextDropComponent: FC<TextDropComponentProps> = ({
  content,
  id,
  color,
  parent,
}) => {
  const core = useCore('minddrop/text-drop');
  // Used to prevent debouncedContentUpdate from being called
  // by the editor onChange fired when the component renders
  const isInitialRender = useRef(true);
  // The value of the editor
  const [value, setValue] = useState(JSON.parse(content));
  // Drag and drop handling
  const { onDragStart } = useDraggableDrop(id);
  // Selection handling
  const { selectedClass, select, isSelected } = useSelectableDrop(id);
  // Debounced callback fired when the editor value changes which
  // updates the drop's content and content revision ID.
  const debouncedContentUpdate = useDebouncedCallback(
    (value: EditorContent, contentRevision: string) =>
      Drops.update<TextDropUpdateData>(core, id, {
        content: JSON.stringify(value),
        contentRevision,
      }),
    500,
    { maxWait: 2000 },
  );

  useEffect(() => {
    // `value` changes on first render, so we ignore
    // the first change.
    if (!isInitialRender.current) {
      debouncedContentUpdate(value, generateId());
    }

    isInitialRender.current = false;
  }, [value]);

  return (
    <Drop
      draggable
      color={color}
      onDragStart={onDragStart}
      className={`text-drop ${selectedClass}`}
    >
      <Editor
        plugins={[TitlePlugin, ParagraphPlugin]}
        value={value}
        onChange={setValue}
      />
      <div
        className="drag-handle"
        onClick={() => (!isSelected ? select() : undefined)}
      />
      <DropActions dropId={id} parent={parent} />
    </Drop>
  );
};
