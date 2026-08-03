import React, { useContext } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Tooltip } from '@minddrop/ui-primitives';
import { ElementPlaceholderText } from '../../ElementPlaceholderText';
import { BlockElementProps } from '../../types';
import { TitleContext } from './TitleContext';
import { TitleElement } from './TitleElement.types';
import './TitleElementComponent.css';

/**
 * Renders the enforced title block displayed as the first node of
 * editors with the title feature enabled. Shows a placeholder when
 * empty and a tooltip containing the validation error while the
 * current title is invalid.
 */
export const TitleElementComponent: React.FC<
  BlockElementProps<TitleElement>
> = ({ children, attributes, element }) => {
  const { t } = useTranslation();
  const { titleError, titlePlaceholder, titleStyle } = useContext(TitleContext);

  return (
    <Tooltip
      open={Boolean(titleError)}
      stringTitle={titleError}
      side="bottom"
      align="start"
    >
      <h1 className="title-element" style={titleStyle} {...attributes}>
        <ElementPlaceholderText
          element={element}
          text={titlePlaceholder ?? t('labels.untitled')}
        />
        {children}
      </h1>
    </Tooltip>
  );
};
