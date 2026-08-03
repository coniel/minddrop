import { ElementType, ReactNode } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Group, Stack, Text, propsToClass } from '@minddrop/ui-primitives';
import './Setting.css';

export interface SettingProps {
  /**
   * The setting title shown on the left.
   */
  title: TranslationKey;

  /**
   * An optional description shown beneath the title.
   */
  description?: TranslationKey;

  /**
   * The control rendered on the right side of the row.
   */
  control: ReactNode;

  /**
   * The root element. Set to 'label' by control variants whose
   * control is a labelable element, so clicking the title or
   * description activates it.
   */
  as?: ElementType;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

/**
 * Base settings row rendering a title and optional description on
 * the left with a control on the right. Typed variants such as
 * SwitchSetting and TextSetting compose this and supply the control.
 */
export const Setting: React.FC<SettingProps> = ({
  title,
  description,
  control,
  as,
  className,
}) => {
  return (
    <Group
      as={as}
      className={propsToClass('setting', { className })}
      align="center"
      justify="between"
      gap={4}
    >
      {/* Title and optional description */}
      <Stack className="setting-body" gap={0}>
        <Text
          className="setting-title"
          size="base"
          weight="medium"
          text={title}
        />
        {/* Only render the description when one is provided */}
        {description && (
          <Text
            block
            className="setting-description"
            size="sm"
            color="muted"
            text={description}
          />
        )}
      </Stack>

      {/* Right-hand control */}
      <div className="setting-control">{control}</div>
    </Group>
  );
};
