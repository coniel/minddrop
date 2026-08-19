import { Select as SelectPrimitive } from '@base-ui/react/select';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';

export interface SelectItemProps {
  /*
   * The display label for the item. Can be an i18n key.
   * Ignored when `children` is provided.
   */
  label?: TranslationKey;

  /*
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /*
   * An optional description shown beneath the label. Can be an i18n key.
   */
  description?: TranslationKey;

  /*
   * Plain string description rendered as-is without i18n
   * translation. Takes priority over `description`.
   */
  stringDescription?: string;

  /*
   * An optional short note shown at the end of the label's line,
   * e.g. the measurement an option resolves to. Can be an i18n key.
   */
  hint?: TranslationKey;

  /*
   * Plain string hint rendered as-is without i18n translation.
   * Takes priority over `hint`.
   */
  stringHint?: string;

  /*
   * The value of the item.
   */
  value: string | number;

  /*
   * Prevents the item from being selected.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * Whether to hide the check indicator column.
   * When true, the item uses a single-column flex layout
   * instead of the two-column grid.
   * @default false
   */
  hideIndicator?: boolean;

  /*
   * Custom item content. When provided, `label` is ignored,
   * allowing full control over the item text rendering.
   */
  children?: React.ReactNode;
}

export const SelectItem = ({
  label,
  stringLabel,
  description,
  stringDescription,
  hint,
  stringHint,
  value,
  disabled,
  className,
  hideIndicator = false,
  children,
}: SelectItemProps) => {
  const { t } = useTranslation();

  // Resolve the displayed content from children or label
  const resolvedChildren = children ?? stringLabel ?? (label ? t(label) : null);

  // Resolve the helper texts from their string or i18n variants
  const resolvedDescription =
    stringDescription ?? (description ? t(description) : null);
  const resolvedHint = stringHint ?? (hint ? t(hint) : null);

  // Renders the item's text, joined by its hint and description
  // when it carries them
  function renderBody() {
    const text = (
      <SelectPrimitive.ItemText className="select-item-text">
        {resolvedChildren}
      </SelectPrimitive.ItemText>
    );

    // Plain items are just their text
    if (!resolvedDescription && !resolvedHint) {
      return text;
    }

    return (
      <div className="select-item-body">
        <div className="select-item-line">
          {text}
          {resolvedHint && (
            <span className="select-item-hint">{resolvedHint}</span>
          )}
        </div>
        {resolvedDescription && (
          <span className="select-item-description">{resolvedDescription}</span>
        )}
      </div>
    );
  }

  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={propsToClass('select-item', {
        className,
        'hide-indicator': hideIndicator || undefined,
        'has-description': resolvedDescription ? true : undefined,
      })}
    >
      {!hideIndicator && (
        <SelectPrimitive.ItemIndicator className="select-item-indicator">
          <Icon name="check" />
        </SelectPrimitive.ItemIndicator>
      )}
      {renderBody()}
    </SelectPrimitive.Item>
  );
};
