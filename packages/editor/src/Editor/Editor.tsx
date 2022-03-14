import React, { useState, useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import {
  EditorContent,
  EditorElementConfig,
  EditorPluginConfig,
  ElementProps,
} from '../types';
import './Editor.css';

interface EditorProps {
  /**
   * The editor content.
   */
  value: EditorContent;

  /**
   * Callback fired when the editor value changes.
   */
  onChange(value: EditorContent): void;

  /**
   * The editor plugins.
   */
  plugins?: EditorPluginConfig[];
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  plugins = [],
}) => {
  const [editor] = useState(() => withReact(createEditor()));
  const elementConfigs = useMemo<EditorElementConfig[]>(
    () =>
      plugins.reduce(
        (configs, plugin) => [...configs, ...(plugin.elements || [])],
        [],
      ),
    [plugins],
  );

  const renderElement = useCallback(
    (props: ElementProps) => {
      const element = elementConfigs.find(
        (config) => config.type === props.element.type,
      );

      if (element) {
        return <element.component {...props} />;
      }

      return <div {...props.attributes}>{props.children}</div>;
    },
    [elementConfigs],
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable className="editor" renderElement={renderElement} />
    </Slate>
  );
};
