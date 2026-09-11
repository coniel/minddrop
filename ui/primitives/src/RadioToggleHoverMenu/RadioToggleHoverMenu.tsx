import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UiIconName } from '@minddrop/ui-icons';
import { FloatingToolbar } from '../FloatingToolbar';
import { Icon } from '../Icon';
import { IconButtonVariant } from '../IconButton';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../Popover';
import { RadioToggleGroup } from '../RadioToggleGroup';
import { Toggle, ToggleSize } from '../Toggle';
import { ToolbarIconButton } from '../Toolbar';
import { TooltipProps } from '../Tooltip';
import {
  BaseUiFocusGuardAttribute,
  ToolbarHoverDimmedControlAttribute,
  ToolbarHoverSquaredCornersAttribute,
} from '../constants';
import { useHoverMenu } from '../hooks';
import { ToolbarHoverSide } from '../types';
import { joinClasses } from '../utils';
import './RadioToggleHoverMenu.css';

export interface RadioToggleHoverMenuOption<Value extends string = string> {
  /**
   * The value the option selects.
   */
  value: Value;

  /**
   * The icon shown on the option, and on the trigger while the
   * option is selected. Omitted for options drawing their own
   * `content`.
   */
  icon?: UiIconName;

  /**
   * Content shown on the option, and on the trigger while the
   * option is selected, for values no icon stands for. Ignored
   * when the option has an `icon`.
   */
  content?: React.ReactNode;

  /**
   * Accessible label of the option.
   */
  label: string;

  /**
   * Tooltip shown on the option. The menu places it itself, so it
   * carries content only.
   */
  tooltip?: Omit<
    TooltipProps,
    'children' | 'side' | 'sideOffset' | 'align' | 'alignOffset'
  >;

  /**
   * Class name applied to the option.
   */
  className?: string;
}

export interface RadioToggleHoverMenuProps<Value extends string = string> {
  /**
   * The options offered, in display order.
   */
  options: RadioToggleHoverMenuOption<Value>[];

  /**
   * The selected value.
   */
  value: Value;

  /**
   * Callback fired with the chosen value.
   */
  onValueChange: (value: Value) => void;

  /**
   * Accessible label of the trigger, naming what the options set.
   */
  label: string;

  /**
   * Visual style of the trigger.
   * @default 'subtle'
   */
  variant?: IconButtonVariant;

  /**
   * Size of the trigger and the options.
   * @default 'md'
   */
  size?: ToggleSize;

  /**
   * Which side of the host toolbar the options reach out of, to be
   * set for a toolbar against the viewport's right edge.
   * @default 'right'
   */
  side?: ToolbarHoverSide;

  /**
   * The number of options a row holds, wrapping the rest onto
   * further rows. Omitted, the options run along a single row.
   */
  columns?: number;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;

  /**
   * Class name applied to the trigger.
   */
  className?: string;
}

/**
 * How far an option's tooltip stands off it, a little further than
 * the default.
 */
const OptionTooltipOffset = 8;

/**
 * The padding a floating toolbar of each size holds its controls
 * in by, which the options clear to start on the host toolbar's
 * edge rather than beside the trigger. The two are taken to be the
 * same size, as a menu and the toolbar carrying it want to be.
 */
const HostPadding: Record<ToggleSize, number> = {
  sm: 2,
  md: 4,
  lg: 8,
};

/**
 * The width of a floating toolbar's border, matching the thin
 * border token. The options are placed against their own border
 * box, so their first row clears it as well as the padding.
 */
const HostBorderWidth = 1;

/**
 * The trigger's place among the host toolbar's controls.
 */
interface HostPlacement {
  /**
   * The trigger's place in the toolbar, from its start.
   */
  index: number;

  /**
   * The number of controls the toolbar holds.
   */
  count: number;
}

/**
 * Renders a set of radio toggles as a hover menu: a trigger showing
 * the selected option's icon, revealing the options in a toolbar
 * beside it as soon as the pointer reaches either. Choosing an
 * option leaves the menu open, so several can be tried in a row.
 *
 * The trigger carries no tooltip of its own, since resting on it is
 * what opens the options, and their tooltips name them.
 *
 * Meant for use in vertical floating toolbars: the options carry the
 * toolbar's surface and join it at the trigger, reading as the
 * toolbar reaching out rather than a menu beside it.
 */
export function RadioToggleHoverMenu<Value extends string>({
  options,
  value,
  onValueChange,
  label,
  variant = 'subtle',
  size = 'md',
  side = 'right',
  columns,
  disabled,
  className,
}: RadioToggleHoverMenuProps<Value>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [hostPlacement, setHostPlacement] = useState<HostPlacement | null>(
    null,
  );
  const { open, setOpen, hoverProps } = useHoverMenu();

  // The selected option, whose icon the trigger shows. An
  // unmatched value leaves the trigger on the first option's icon.
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  // The rows the options open into
  const rowCount = columns ? Math.ceil(options.length / columns) : 1;

  // Rows hang off the trigger's own row, rising above it instead at
  // the toolbar's end, where there is no row below to hang from.
  const bottomAnchored =
    rowCount > 1 &&
    hostPlacement !== null &&
    hostPlacement.index === hostPlacement.count - 1;

  // The toolbar row the options start on, which is the trigger's
  // own unless they rise above it.
  const firstRow = hostPlacement
    ? hostPlacement.index - (bottomAnchored ? rowCount - 1 : 0)
    : 0;

  // The options run flush with the toolbar's ends their rows reach,
  // since both are inset by the same padding: there is no corner to
  // round there, and the toolbar's own corner falls inside the shape
  // the two make.
  const flushStart = hostPlacement !== null && firstRow <= 0;
  const flushEnd =
    hostPlacement !== null &&
    firstRow + rowCount - 1 >= hostPlacement.count - 1;

  // Place the trigger among the toolbar's controls before the menu
  // is painted, its place deciding which way the rows hang.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const host = trigger?.parentElement;

    if (!open || !trigger || !host) {
      setHostPlacement(null);

      return;
    }

    setHostPlacement(resolveHostPlacement(trigger, host));
  }, [open]);

  // Step the controls the rows run alongside back, so the arm
  // reads as standing in their place. The trigger keeps its weight,
  // the menu being its own.
  useEffect(() => {
    const trigger = triggerRef.current;
    const host = trigger?.parentElement;

    if (!open || !host || rowCount === 1) {
      return;
    }

    // The controls the rows other than the trigger's own reach
    const covered = resolveHostControls(host).filter(
      (control, index) =>
        control !== trigger && index >= firstRow && index < firstRow + rowCount,
    );

    covered.forEach((control) => {
      control.setAttribute(ToolbarHoverDimmedControlAttribute, '');
    });

    return () => {
      covered.forEach((control) => {
        control.removeAttribute(ToolbarHoverDimmedControlAttribute);
      });
    };
  }, [open, rowCount, firstRow]);

  // Tell the toolbar which of its corners the options run through,
  // which it squares for as long as they do.
  useEffect(() => {
    const host = triggerRef.current?.parentElement;

    // The corners the options run through, named for the side they
    // open towards.
    const corners = [
      flushStart ? `top-${side}` : undefined,
      flushEnd ? `bottom-${side}` : undefined,
    ]
      .filter(Boolean)
      .join(' ');

    if (!open || !host || !corners) {
      return;
    }

    host.setAttribute(ToolbarHoverSquaredCornersAttribute, corners);

    return () => {
      // Leave corners another menu has since claimed alone
      if (host.getAttribute(ToolbarHoverSquaredCornersAttribute) === corners) {
        host.removeAttribute(ToolbarHoverSquaredCornersAttribute);
      }
    };
  }, [open, flushStart, flushEnd, side]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The options follow the pointer onto the trigger with no
          rest delay, and leave with it */}
      <PopoverTrigger ref={triggerRef} openOnHover delay={0} closeDelay={0}>
        <ToolbarIconButton
          stringLabel={label}
          variant={variant}
          size={size}
          active={open}
          disabled={disabled}
          className={joinClasses('radio-toggle-hover-menu-trigger', className)}
          {...hoverProps}
        >
          {selectedOption && renderOptionContent(selectedOption)}
        </ToolbarIconButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner
          side={side}
          align={resolveAlign(rowCount, bottomAnchored)}
          // Clears the options' own border and padding, so the row
          // they hang from lines up with the trigger rather than
          // the popup's edge. The offset runs along the alignment,
          // so the same value carries the rows either way.
          alignOffset={
            rowCount > 1 ? -(HostPadding[size] + HostBorderWidth) : undefined
          }
          sideOffset={HostPadding[size]}
        >
          {/* The popup is a shell around the options toolbar,
              carrying the hover buffer */}
          <PopoverContent
            className="radio-toggle-hover-menu-popup"
            {...hoverProps}
          >
            <FloatingToolbar
              size={size}
              visible
              className={joinClasses(
                'radio-toggle-hover-menu-options',
                `radio-toggle-hover-menu-options-side-${side}`,
                flushStart
                  ? 'radio-toggle-hover-menu-options-flush-start'
                  : undefined,
                flushEnd
                  ? 'radio-toggle-hover-menu-options-flush-end'
                  : undefined,
              )}
            >
              <RadioToggleGroup<Value>
                size={size}
                value={value}
                onValueChange={onValueChange}
                className={columns ? 'radio-toggle-hover-menu-rows' : undefined}
                // Laid out inline so the column count wins over the
                // group's own row layout.
                style={
                  columns
                    ? {
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columns}, auto)`,
                      }
                    : undefined
                }
              >
                {options.map((option, index) => (
                  <Toggle
                    key={option.value}
                    value={option.value}
                    icon={option.icon}
                    label={option.label}
                    tooltip={
                      option.tooltip && {
                        ...option.tooltip,
                        // Clear of the option's neighbours and of
                        // the toolbar they came out of: below the
                        // option, or above it for a row with
                        // another row beneath it.
                        side: isTopRow(index, columns) ? 'top' : 'bottom',
                        align: side === 'right' ? 'start' : 'end',
                        sideOffset: OptionTooltipOffset,
                      }
                    }
                    className={option.className}
                  >
                    {option.icon ? undefined : option.content}
                  </Toggle>
                ))}
              </RadioToggleGroup>
            </FloatingToolbar>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}

RadioToggleHoverMenu.displayName = 'RadioToggleHoverMenu';

/**
 * Says whether an option sits in the top row of a menu holding
 * more than one, its tooltip opening upward to clear the row below.
 *
 * @param index - The option's place in the menu.
 * @param columns - The number of options a row holds, when the menu
 *   wraps into rows.
 * @returns Whether the option sits in the top row.
 */
function isTopRow(index: number, columns: number | undefined): boolean {
  return columns !== undefined && index < columns;
}

/**
 * Renders what an option shows: its icon, or the content it draws
 * for itself where no icon stands for its value.
 *
 * @param option - The option to render.
 * @returns The option's content.
 */
function renderOptionContent(
  option: RadioToggleHoverMenuOption<string>,
): React.ReactNode {
  return option.icon ? <Icon name={option.icon} /> : option.content;
}

/**
 * Resolves which way the rows of options hang off the trigger: a
 * single row sits across from it, several hang below it, and at the
 * toolbar's end they rise above it instead.
 *
 * @param rowCount - The rows the options open into.
 * @param bottomAnchored - Whether the trigger takes the bottom row.
 * @returns The alignment the options take against the trigger.
 */
function resolveAlign(
  rowCount: number,
  bottomAnchored: boolean,
): 'center' | 'start' | 'end' {
  if (rowCount === 1) {
    return 'center';
  }

  return bottomAnchored ? 'end' : 'start';
}

/**
 * Resolves a control's place among a toolbar's controls, ignoring
 * the focus guards rendered around an open popover trigger.
 *
 * @param control - The control to place.
 * @param host - The toolbar holding it.
 * @returns The control's place, or null where the toolbar does not
 *   hold it.
 */
function resolveHostPlacement(
  control: HTMLElement,
  host: HTMLElement,
): HostPlacement | null {
  const controls = resolveHostControls(host);
  const index = controls.indexOf(control);

  return index === -1 ? null : { index, count: controls.length };
}

/**
 * Resolves a toolbar's controls, ignoring the focus guards
 * rendered around an open popover trigger.
 *
 * @param host - The toolbar to read.
 * @returns The toolbar's controls, in order.
 */
function resolveHostControls(host: HTMLElement): Element[] {
  return Array.from(host.children).filter(
    (child) => !child.hasAttribute(BaseUiFocusGuardAttribute),
  );
}
