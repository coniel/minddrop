import { ElementColor } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { ContentColorSwatch, ToolbarHoverPanel } from '@minddrop/ui-primitives';
import { ElementColorSelect } from '../ElementColorSelect';
import './ElementColorControl.css';

export interface ElementColorControlProps {
  /**
   * i18n key naming what the colour is set on.
   */
  label: TranslationKey;

  /**
   * The colour it is set in.
   */
  value: ElementColor;

  /**
   * Callback fired with the chosen colour.
   */
  onValueChange: (color: ElementColor) => void;
}

/**
 * Renders a toolbar button which opens the colour picker out of the
 * toolbar. Its swatch shows the colour it sets.
 *
 * Element controls setting a colour wrap the picker in one of
 * these, naming what they colour.
 */
export const ElementColorControl: React.FC<ElementColorControlProps> = ({
  label,
  value,
  onValueChange,
}) => {
  const { t } = useTranslation();

  return (
    <ToolbarHoverPanel
      label={t(label)}
      trigger={
        <ContentColorSwatch
          color={value.color}
          level={value.level}
          unset={value.color === 'default'}
        />
      }
    >
      <div className="design-element-color-control-panel">
        <ElementColorSelect value={value} onValueChange={onValueChange} />
      </div>
    </ToolbarHoverPanel>
  );
};
