import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { ToDoElement } from '@minddrop/ast';
import { Icon } from '@minddrop/ui-primitives';
import { propsToClass } from '@minddrop/ui-primitives';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { Transforms } from '../../Transforms';
import { ToDoElementProps } from './ToDoElement.types';
import './ToDoElementComponent.css';

export const ToDoElementComponent: React.FC<ToDoElementProps> = ({
  children,
  attributes,
  element,
}) => {
  const editor = useSlate();

  // Toggles the to-do's `checked` state
  const togglechecked = () => {
    // Get the element's path
    const path = ReactEditor.findPath(editor, element);

    // Update the element's data
    Transforms.setNodes<ToDoElement>(
      editor,
      // Toggle the `checked` value
      { checked: !element.checked },
      { at: path },
    );
  };

  return (
    <div
      className={propsToClass('to-do-element', { checked: element.checked })}
      {...attributes}
    >
      <div contentEditable={false}>
        <Icon
          onClick={togglechecked}
          role="button"
          name={element.checked ? 'check-square' : 'square'}
        />
      </div>
      <div className="content">
        <ElementPlaceholderText element={element} text="To-do" />
        {children}
      </div>
    </div>
  );
};
