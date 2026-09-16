import { Designs, ElementPadding } from '@minddrop/designs-next';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  PopoverTrigger,
  useHoverMenu,
} from '@minddrop/ui-primitives';
import { NoValueGlyph } from '../../constants';
import { NumberLadder, NumberLadderOption } from '../NumberLadder';

export type PaddingSideName = keyof ElementPadding;

export interface PaddingSideProps {
  /**
   * The side of the element's box.
   */
  side: PaddingSideName;

  /**
   * The side's padding, in pixels.
   */
  amount: number;

  /**
   * The element's box. The side's scale renders inside it.
   */
  container: React.RefObject<HTMLDivElement | null>;

  /**
   * Callback fired with the amount picked for the side.
   */
  onAmountChange: (amount: number) => void;
}

// The steps of the padding scale, in the order they are offered
const PaddingSizes = Object.keys(
  Designs.constants.PaddingSizes,
) as (keyof typeof Designs.constants.PaddingSizes)[];

// The values a row of the scale holds
const ScaleColumns = 5;

// Which way each side's scale opens. Inwards, so the side it was
// opened from stays visible.
const ScaleSides: Record<
  PaddingSideName,
  NonNullable<PopoverPositionerProps['side']>
> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

const paddingSideKey = createI18nKeyBuilder('designsNext.padding.');
const paddingSizeKey = createI18nKeyBuilder('designsNext.padding.sizes.');

/**
 * Renders one side of the element's box. Shows the side's padding
 * and opens the scale which sets it.
 */
export const PaddingSide: React.FC<PaddingSideProps> = ({
  side,
  amount,
  container,
  onAmountChange,
}) => {
  const { t } = useTranslation();
  const { open, setOpen, hoverProps } = useHoverMenu();

  const sizeOptions: NumberLadderOption[] = [
    // Clears the side
    { value: 0, label: t('designsNext.padding.none'), content: NoValueGlyph },
    // The scale's steps
    ...PaddingSizes.map((size) => ({
      value: Designs.constants.PaddingSizes[size],
      label: t(paddingSizeKey(size)),
    })),
  ];

  // Shows the name of the step the amount sits on, the amount
  // itself when it is off the scale, or a dash for no padding.
  function resolveAmountLabel(): string {
    if (!amount) {
      return NoValueGlyph;
    }

    const size = Designs.resolvePaddingSize(amount);

    if (size) {
      return t(paddingSizeKey(size));
    }

    return String(amount);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          role="button"
          tabIndex={0}
          aria-label={t(paddingSideKey(side))}
          className={resolveSideClass(side, open)}
          {...hoverProps}
        >
          {resolveAmountLabel()}
        </div>
      </PopoverTrigger>
      {/** Rendered inside the box rather than the document body.
       * The panel around it closes when the pointer leaves it, and
       * only counts elements inside itself as still being on it. **/}
      <PopoverPortal
        container={container}
        className="design-padding-control-scale-portal"
      >
        <PopoverPositioner side={ScaleSides[side]} align="center">
          <PopoverContent
            className="design-padding-control-scale"
            {...hoverProps}
          >
            <NumberLadder
              options={sizeOptions}
              columns={ScaleColumns}
              value={amount}
              min={0}
              max={Designs.constants.MaxPadding}
              onValueChange={onAmountChange}
            />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

/**
 * Resolves a side's class names from its place on the box and
 * whether its scale is open.
 *
 * @param side - The side of the box.
 * @param open - Whether the side's scale is open.
 * @returns The side's class name string.
 */
function resolveSideClass(side: PaddingSideName, open: boolean): string {
  const classes = [
    'design-padding-control-side',
    `design-padding-control-side-${side}`,
  ];

  // Keep the side shaded while its scale is open
  if (open) {
    classes.push('design-padding-control-side-open');
  }

  return classes.join(' ');
}
