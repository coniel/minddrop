import { ElementType, ReactNode } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Group, Stack, Text, propsToClass } from '@minddrop/ui-primitives';
import './Setting.css';

export interface SettingProps {
  /**
   * The setting title shown on the left.
   */
  title?: TranslationKey;

  /**
   * Plain string title rendered without i18n translation. Takes
   * priority over `title`.
   */
  stringTitle?: string;

  /**
   * An optional description shown beneath the title.
   */
  description?: TranslationKey;

  /**
   * Plain string description rendered without i18n translation.
   * Takes priority over `description`.
   */
  stringDescription?: string;

  /**
   * The control rendered on the right side of the row.
   */
  control: ReactNode;

  /**
   * The root element. Set to 'label' when the control is a labelable
   * element, so clicking the title or description activates it.
   */
  as?: ElementType;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

/**
 * Renders a settings row with a title and optional description on the
 * left and a control on the right.
 */
export const Setting: React.FC<SettingProps> = ({
  title,
  stringTitle,
  description,
  stringDescription,
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
          stringText={stringTitle}
        />
        {/* Only render the description when one is provided */}
        {(description || stringDescription) && (
          <Text
            block
            className="setting-description"
            size="sm"
            color="muted"
            text={description}
            stringText={stringDescription}
          />
        )}
      </Stack>

      {/* Right-hand control */}
      <div className="setting-control">{control}</div>
    </Group>
  );
};
