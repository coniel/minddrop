import { useLayoutEffect, useRef, useState } from 'react';
import { FloatingToolbar } from '../FloatingToolbar';
import { IconButton, IconButtonVariant } from '../IconButton';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../Popover';
import { ToggleSize } from '../Toggle';
import {
  BaseUiFocusGuardAttribute,
  ToolbarHoverSquaredCornersAttribute,
} from '../constants';
import { useHoverMenu } from '../hooks';
import { ToolbarHoverSide } from '../types';
import { joinClasses } from '../utils';
import './ToolbarHoverPanel.css';

export interface ToolbarHoverPanelProps {
  /**
   * The panel's contents.
   */
  children: React.ReactNode;

  /**
   * What the trigger shows: an icon, or the content standing in for
   * one.
   */
  trigger: React.ReactNode;

  /**
   * Accessible label of the trigger, naming what the panel holds.
   */
  label: string;

  /**
   * Which side of the host toolbar the panel reaches out of, to be
   * set for a toolbar against the viewport's right edge.
   * @default 'right'
   */
  side?: ToolbarHoverSide;

  /**
   * Size of the trigger, matching the host toolbar's.
   * @default 'md'
   */
  size?: ToggleSize;

  /**
   * Visual style of the trigger.
   * @default 'subtle'
   */
  variant?: IconButtonVariant;

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
 * The stretch of toolbar an open panel stands alongside.
 */
interface PanelJunction {
  /**
   * How far the panel's top edge stands above the trigger, clearing
   * the toolbar's padding and border so the two line up.
   */
  inset: number;

  /**
   * How far the panel stands off the trigger, meeting the toolbar's
   * edge rather than floating beside it.
   */
  sideOffset: number;

  /**
   * The length of the toolbar's edge the panel covers, from its own
   * top edge to the toolbar's end.
   */
  length: number;

  /**
   * Whether the panel starts at the toolbar's own start, the
   * trigger being its first control.
   */
  flushStart: boolean;
}

/**
 * Renders a panel held behind a toolbar button, opened on hover.
 * The panel and the toolbar share a surface. A fillet joins them at
 * the trigger, another at the toolbar's end, and the edge they meet
 * along is covered over.
 *
 * Meant for content too tall for an arm of controls. A panel
 * reaches from the trigger past the toolbar's end, rather than
 * alongside it.
 *
 * The trigger carries no tooltip of its own. Resting on it is what
 * opens the panel.
 */
export const ToolbarHoverPanel: React.FC<ToolbarHoverPanelProps> = ({
  children,
  trigger,
  label,
  side = 'right',
  size = 'md',
  variant = 'subtle',
  disabled,
  className,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [junction, setJunction] = useState<PanelJunction | null>(null);
  const { open, setOpen, hoverProps } = useHoverMenu();

  // Measure the toolbar before the panel is painted. Its padding
  // places the panel, its end sizes the junction.
  useLayoutEffect(() => {
    const control = triggerRef.current;
    const host = control?.parentElement;

    if (!open || !control || !host) {
      setJunction(null);

      return;
    }

    setJunction(resolvePanelJunction(control, host));
  }, [open]);

  // Square the corners the panel's surface covers. Always the
  // toolbar's end, and its start for a panel on the first
  // control.
  useLayoutEffect(() => {
    const host = triggerRef.current?.parentElement;
    const corners = [
      junction?.flushStart ? `top-${side}` : undefined,
      `bottom-${side}`,
    ]
      .filter(Boolean)
      .join(' ');

    if (!open || !host) {
      return;
    }

    host.setAttribute(ToolbarHoverSquaredCornersAttribute, corners);

    return () => {
      // Leave corners another menu has since claimed alone
      if (host.getAttribute(ToolbarHoverSquaredCornersAttribute) === corners) {
        host.removeAttribute(ToolbarHoverSquaredCornersAttribute);
      }
    };
  }, [open, junction, side]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The panel follows the pointer onto the trigger with no
          rest delay, and leaves with it */}
      <PopoverTrigger openOnHover delay={0} closeDelay={0}>
        <IconButton
          ref={triggerRef}
          stringLabel={label}
          variant={variant}
          size={size}
          active={open}
          disabled={disabled}
          className={joinClasses('toolbar-hover-panel-trigger', className)}
          {...hoverProps}
        >
          {trigger}
        </IconButton>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner
          side={side}
          align="start"
          // Clears the panel's own border and padding, so its top
          // edge lines up with the trigger rather than with the
          // popup's edge.
          alignOffset={-(junction?.inset ?? 0)}
          sideOffset={junction?.sideOffset ?? 0}
        >
          {/* The popup is a shell around the panel, carrying the
              hover buffer and the pieces of the junction which fall
              outside the panel's own surface */}
          <PopoverContent
            className="toolbar-hover-panel-popup"
            style={
              {
                // The stretch of the toolbar's edge the panel
                // covers, which the seam runs the length of and the
                // lower fillet sits at the end of.
                '--toolbar-hover-panel-junction': `${junction?.length ?? 0}px`,
              } as React.CSSProperties
            }
            {...hoverProps}
          >
            <FloatingToolbar
              size={size}
              visible
              className={joinClasses(
                'toolbar-hover-panel',
                `toolbar-hover-panel-side-${side}`,
                junction?.flushStart
                  ? 'toolbar-hover-panel-flush-start'
                  : undefined,
              )}
            >
              {children}
            </FloatingToolbar>

            {/* The edge the two meet along, painted over in the
                surface they share so neither border shows through */}
            <span className="toolbar-hover-panel-seam" />

            {/* The fillet at the toolbar's end, curving its edge
                into the panel's */}
            <span className="toolbar-hover-panel-fillet" />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

/**
 * Measures the junction between an open panel and the toolbar it
 * reaches out of.
 *
 * @param control - The panel's trigger.
 * @param host - The toolbar holding the trigger.
 * @returns The junction's placement and length.
 */
function resolvePanelJunction(
  control: HTMLElement,
  host: HTMLElement,
): PanelJunction {
  const hostStyle = getComputedStyle(host);
  const padding = parseFloat(hostStyle.paddingTop) || 0;
  const border = parseFloat(hostStyle.borderTopWidth) || 0;
  const inset = padding + border;

  return {
    inset,
    sideOffset: padding,
    // The panel's top edge stands the inset above the trigger. It
    // covers that much more of the toolbar's edge.
    length:
      host.getBoundingClientRect().bottom -
      control.getBoundingClientRect().top +
      inset,
    flushStart: resolveHostControls(host).indexOf(control) === 0,
  };
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
