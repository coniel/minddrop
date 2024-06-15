import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Icon } from '@minddrop/ui';
import { Transforms } from '../../Transforms';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { ToDoElementProps } from './ToDoElement.types';
import './ToDoElementComponent.css';
import { ToDoElement } from '@minddrop/ast';

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
      className={mapPropsToClasses(
        { checked: element.checked },
        'to-do-element',
      )}
      {...attributes}
    >
      <div contentEditable={false}>
        <Icon
          onClick={togglechecked}
          role="button"
          name={element.checked ? 'checkmark-square-2' : 'square'}
        />
      </div>
      <div className="content">
        <ElementPlaceholderText element={element} text="To-do" />
        {children}
      </div>
    </div>
  );
};
