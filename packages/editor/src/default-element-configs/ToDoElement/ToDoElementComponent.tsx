import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Icon } from '@minddrop/ui';
import { Transforms } from '../../Transforms';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { ToDoElement, ToDoElementProps } from './ToDoElement.types';
import './ToDoElementComponent.css';

export const ToDoElementComponent: React.FC<ToDoElementProps> = ({
  children,
  attributes,
  element,
}) => {
  const editor = useSlate();

  // Toggles the to-do's `done` state
  const toggleDone = () => {
    // Get the element's path
    const path = ReactEditor.findPath(editor, element);

    // Update the element's data
    Transforms.setNodes<ToDoElement>(
      editor,
      // Toggle the `done` value
      { done: !element.done },
      { at: path },
    );
  };

  return (
    <div
      className={mapPropsToClasses({ done: element.done }, 'to-do-element')}
      {...attributes}
    >
      <div contentEditable={false}>
        <Icon
          onClick={toggleDone}
          role="button"
          name={element.done ? 'checkmark-square' : 'square'}
        />
      </div>
      <div className="content">
        <ElementPlaceholderText element={element} text="To-do" />
        {children}
      </div>
    </div>
  );
};
