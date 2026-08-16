import React from 'react';
import { MathElement } from '@minddrop/ast';
import { useTranslation } from '@minddrop/i18n';
import { BlockElementProps } from '../../types';
import './MathElementComponent.css';

/**
 * Renders a math block as its unformatted expression.
 */
export const MathElementComponent: React.FC<BlockElementProps<MathElement>> = ({
  children,
  attributes,
}) => {
  const { t } = useTranslation({ keyPrefix: 'editor.elements.math' });

  return (
    <div className="math-element" {...attributes}>
      <span className="math-element-label" contentEditable={false}>
        {t('name')}
      </span>
      <pre className="math-element-source">{children}</pre>
    </div>
  );
};
