import { useRef, useState } from 'react';
import { Designs, ElementPadding } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import {
  Icon,
  IconButton,
  InputLabel,
  Stack,
  ToolbarHoverPanel,
} from '@minddrop/ui-primitives';
import { PaddingSide, PaddingSideName } from './PaddingSide';
import './PaddingControl.css';

export interface PaddingControlProps {
  /**
   * The padding the element holds, or undefined while it holds
   * none.
   */
  value: ElementPadding | undefined;

  /**
   * Callback fired with the padding the control sets, or undefined
   * when every side is cleared.
   */
  onValueChange: (padding: ElementPadding | undefined) => void;
}

/**
 * Renders the padding picker, opened out of the toolbar: the
 * element's block drawn as a box, with a control per side and a
 * toggle which links them.
 */
export const PaddingControl: React.FC<PaddingControlProps> = ({
  value,
  onValueChange,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  // Sides start unlinked: padding is usually tuned per edge, so
  // linking is the deliberate choice.
  const [linked, setLinked] = useState(false);
  const { t } = useTranslation();

  // The link toggle is labelled by what pressing it does
  const linkLabel: TranslationKey = linked
    ? 'designsNext.padding.unlink'
    : 'designsNext.padding.link';

  // Sets an amount on the given sides. Emits undefined once no
  // side has any padding left.
  function changePadding(sides: PaddingSideName[], amount: number) {
    const padding: ElementPadding = { ...value };

    sides.forEach((side) => {
      // Zero is no padding, so drop the side
      if (amount === 0) {
        delete padding[side];

        return;
      }

      padding[side] = amount;
    });

    onValueChange(
      Designs.constants.PaddingSides.some((side) => padding[side])
        ? padding
        : undefined,
    );
  }

  // Sets one side, or all four while they are linked
  function handleSideChange(side: PaddingSideName, amount: number) {
    changePadding(linked ? Designs.constants.PaddingSides : [side], amount);
  }

  // Links or unlinks the sides. Linking copies the top side's
  // amount to all four.
  function handleToggleLink() {
    if (linked) {
      setLinked(false);

      return;
    }

    changePadding(Designs.constants.PaddingSides, value?.top ?? 0);
    setLinked(true);
  }

  return (
    <ToolbarHoverPanel
      label={t('designsNext.padding.label')}
      trigger={<Icon name="square-square" />}
      padded
    >
      <Stack gap={2}>
        <InputLabel size="xs" label="designsNext.padding.label" />
        <div ref={boxRef} className="design-padding-control-box">
          {Designs.constants.PaddingSides.map((side) => (
            <PaddingSide
              key={side}
              side={side}
              amount={value?.[side] ?? 0}
              container={boxRef}
              onAmountChange={(amount) => handleSideChange(side, amount)}
            />
          ))}
          <div className="design-padding-control-content">
            <IconButton
              icon={linked ? 'link' : 'unlink'}
              label={linkLabel}
              variant="subtle"
              size="md"
              color={linked ? 'neutral' : 'muted'}
              onClick={handleToggleLink}
            />
          </div>
        </div>
      </Stack>
    </ToolbarHoverPanel>
  );
};
