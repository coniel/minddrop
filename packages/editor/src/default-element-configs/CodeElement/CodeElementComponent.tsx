import React from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { CodeElement } from '@minddrop/ast';
import { useTranslation } from '@minddrop/i18n';
import { TextInput } from '@minddrop/ui-primitives';
import { Transforms } from '../../Transforms';
import { BlockElementProps } from '../../types';
import './CodeElementComponent.css';

/**
 * Renders a code block as unformatted source with a field for its language.
 */
export const CodeElementComponent: React.FC<BlockElementProps<CodeElement>> = ({
  children,
  attributes,
  element,
}) => {
  const { t } = useTranslation({ keyPrefix: 'editor.elements.code' });
  const editor = useSlateStatic();

  const handleLanguageChange = (language: string) => {
    const path = ReactEditor.findPath(editor, element);

    Transforms.setNodes<CodeElement>(editor, { lang: language }, { at: path });
  };

  return (
    <div className="code-element" {...attributes}>
      <div className="code-element-toolbar" contentEditable={false}>
        <TextInput
          variant="ghost"
          size="sm"
          textSize="xs"
          color="subtle"
          unassisted
          value={element.lang ?? ''}
          onValueChange={handleLanguageChange}
          stringPlaceholder={t('language')}
        />
      </div>
      <pre className="code-element-source">{children}</pre>
    </div>
  );
};
