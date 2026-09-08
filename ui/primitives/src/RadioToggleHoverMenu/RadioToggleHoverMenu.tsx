import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { UiIconName } from '@minddrop/ui-icons';
import { FloatingToolbar } from '../FloatingToolbar';
import { Icon } from '../Icon';
import { IconButton, IconButtonVariant } from '../IconButton';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../Popover';
import { RadioToggleGroup } from '../RadioToggleGroup';
import { Toggle, ToggleSize } from '../Toggle';
import { TooltipProps } from '../Tooltip';
import { BaseUiFocusGuardAttribute } from '../constants';
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
  side?: MenuSide;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;

  /**
   * Class name applied to the trigger.
   */
  className?: string;
}

// How long after the pointer leaves the menu it closes, giving a
// pointer that grazes past it a moment to come back.
const CloseDelay = 80;

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
 * The corners of the host toolbar the open menu squares off, set on
 * it so it can drop the rounding the options run through.
 */
const HostSquaredCornersAttribute = 'data-hover-menu-squared';

/**
 * The side of the host toolbar the options reach out of.
 */
export type MenuSide = 'left' | 'right';

/**
 * Which of the host toolbar's ends the trigger sits at, if either.
 */
type HostEdge = 'start' | 'end' | 'both';

// The toolbar corners each end runs flush with, by the side the
// options open towards.
const FlushCorners: Record<MenuSide, Record<HostEdge, string>> = {
  right: {
    start: 'top-right',
    end: 'bottom-right',
    both: 'top-right bottom-right',
  },
  left: {
    start: 'top-left',
    end: 'bottom-left',
    both: 'top-left bottom-left',
  },
};

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
  disabled,
  className,
}: RadioToggleHoverMenuProps<Value>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState(false);
  const [hostEdge, setHostEdge] = useState<HostEdge | null>(null);
  const menuId = useId();

  // The selected option, whose icon the trigger shows. An
  // unmatched value leaves the trigger on the first option's icon.
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  // The options run flush with the toolbar's end where the trigger
  // sits at one, since both are inset by the same padding: there is
  // no corner to round there, and the toolbar's own corner falls
  // inside the shape the two make.
  const flushStart = hostEdge === 'start' || hostEdge === 'both';
  const flushEnd = hostEdge === 'end' || hostEdge === 'both';

  // Track which of the toolbar's ends the open menu reaches, and
  // tell the toolbar, which squares that corner for as long as the
  // options run through it.
  useEffect(() => {
    const trigger = triggerRef.current;
    const host = trigger?.parentElement;

    if (!open || !trigger || !host) {
      setHostEdge(null);

      return;
    }

    const edge = resolveHostEdge(trigger, host);

    setHostEdge(edge);

    if (!edge) {
      return;
    }

    const corners = FlushCorners[side][edge];

    host.setAttribute(HostSquaredCornersAttribute, corners);

    return () => {
      // Leave corners another menu has since claimed alone
      if (host.getAttribute(HostSquaredCornersAttribute) === corners) {
        host.removeAttribute(HostSquaredCornersAttribute);
      }
    };
  }, [open, side]);

  // Holds the menu open while the pointer is on it
  const handlePointerEnter = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
  }, []);

  // Closes the menu once the pointer leaves it for somewhere that
  // is neither the trigger nor the options, the two being marked as
  // one menu so that crossing between them keeps it open.
  //
  // Closing is ours rather than the popover's because the popover
  // stops closing on hover for good once something inside it has
  // been pressed, which for this menu is every time an option is
  // chosen.
  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      const enteredElement = event.relatedTarget;

      if (
        enteredElement instanceof Element &&
        enteredElement.closest(`[data-hover-menu="${menuId}"]`)
      ) {
        return;
      }

      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => setOpen(false), CloseDelay);
    },
    [menuId],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The options follow the pointer onto the trigger with no
          rest delay, and leave with it */}
      <PopoverTrigger ref={triggerRef} openOnHover delay={0} closeDelay={0}>
        <IconButton
          stringLabel={label}
          variant={variant}
          size={size}
          active={open}
          disabled={disabled}
          className={joinClasses('radio-toggle-hover-menu-trigger', className)}
          data-hover-menu={menuId}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          {selectedOption && renderOptionContent(selectedOption)}
        </IconButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner
          side={side}
          align="center"
          sideOffset={HostPadding[size]}
        >
          {/* The popup is a shell around the options toolbar,
              carrying the hover buffer */}
          <PopoverContent
            className="radio-toggle-hover-menu-popup"
            data-hover-menu={menuId}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
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
              >
                {options.map((option) => (
                  <Toggle
                    key={option.value}
                    value={option.value}
                    icon={option.icon}
                    label={option.label}
                    tooltip={
                      option.tooltip && {
                        ...option.tooltip,
                        // Below the option and running away from
                        // the toolbar, the one direction with
                        // neither its neighbours nor the toolbar
                        // they came out of in the way.
                        side: 'bottom',
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
 * Resolves which of a toolbar's ends a control sits at, ignoring
 * the focus guards rendered around an open popover trigger.
 *
 * @param control - The control to place.
 * @param host - The toolbar holding it.
 * @returns The end it sits at, or null for a control between them.
 */
function resolveHostEdge(
  control: HTMLElement,
  host: HTMLElement,
): HostEdge | null {
  const controls = Array.from(host.children).filter(
    (child) => !child.hasAttribute(BaseUiFocusGuardAttribute),
  );

  const atStart = controls[0] === control;
  const atEnd = controls[controls.length - 1] === control;

  if (atStart && atEnd) {
    return 'both';
  }

  if (atStart) {
    return 'start';
  }

  return atEnd ? 'end' : null;
}
