import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FloatingToolbar } from '../FloatingToolbar';
import { IconButtonVariant } from '../IconButton';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '../Popover';
import { ToggleSize } from '../Toggle';
import { ToolbarIconButton } from '../Toolbar';
import {
  BaseUiFocusGuardAttribute,
  ToolbarHoverDimmedControlAttribute,
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

  /**
   * Whether the panel reaches past the toolbar's end. Otherwise it
   * stands alongside the toolbar, its bottom edge curving back into
   * the toolbar's.
   */
  reachesEnd: boolean;
}

/**
 * Renders a panel held behind a toolbar button, opened on hover.
 * The panel and the toolbar share a surface. A fillet joins them at
 * the trigger, another at the toolbar's end, and the edge they meet
 * along is covered over.
 *
 * Meant for content too tall for an arm of controls. A panel
 * reaches from the trigger past the toolbar's end, or stands
 * alongside the toolbar when its content ends first.
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
  // The panel's node, held in state since it mounts in a portal
  // after the trigger opens it and is measured once it has.
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const [junction, setJunction] = useState<PanelJunction | null>(null);
  const { open, setOpen, hoverProps } = useHoverMenu();

  // Until measured, the panel is taken to reach the toolbar's end
  const reachesEnd = junction?.reachesEnd ?? true;

  // Measure the toolbar and the panel before the panel is painted.
  // The toolbar's padding places the panel, and its end against the
  // panel's own sizes the junction.
  useLayoutEffect(() => {
    const control = triggerRef.current;
    const host = control?.parentElement;

    if (!open || !control || !host) {
      setJunction(null);

      return;
    }

    setJunction(resolvePanelJunction(control, host, panel));
  }, [open, panel]);

  // Square the corners the panel's surface covers: the toolbar's
  // end when the panel reaches past it, and its start for a panel
  // on the first control.
  useLayoutEffect(() => {
    const host = triggerRef.current?.parentElement;
    const corners = [
      junction?.flushStart ? `top-${side}` : undefined,
      reachesEnd ? `bottom-${side}` : undefined,
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
  }, [open, junction, reachesEnd, side]);

  // Step the controls the panel runs alongside back, so the panel
  // reads as standing in their place. The trigger keeps its weight,
  // the panel being its own.
  useEffect(() => {
    const control = triggerRef.current;
    const host = control?.parentElement;

    if (!open || !control || !host || !junction) {
      return;
    }

    const covered = resolveCoveredControls(control, host, junction);

    covered.forEach((other) => {
      other.setAttribute(ToolbarHoverDimmedControlAttribute, '');
    });

    return () => {
      covered.forEach((other) => {
        other.removeAttribute(ToolbarHoverDimmedControlAttribute);
      });
    };
  }, [open, junction]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The panel follows the pointer onto the trigger with no
          rest delay, and leaves with it */}
      <PopoverTrigger openOnHover delay={0} closeDelay={0}>
        <ToolbarIconButton
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
        </ToolbarIconButton>
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
              ref={setPanel}
              size={size}
              visible
              className={joinClasses(
                'toolbar-hover-panel',
                `toolbar-hover-panel-side-${side}`,
                junction?.flushStart
                  ? 'toolbar-hover-panel-flush-start'
                  : undefined,
                reachesEnd ? undefined : 'toolbar-hover-panel-alongside',
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
 * @param panel - The panel, or null before it has rendered.
 * @returns The junction's placement and length.
 */
function resolvePanelJunction(
  control: HTMLElement,
  host: HTMLElement,
  panel: HTMLElement | null,
): PanelJunction {
  const hostStyle = getComputedStyle(host);
  const padding = parseFloat(hostStyle.paddingTop) || 0;
  const border = parseFloat(hostStyle.borderTopWidth) || 0;
  const inset = padding + border;

  // The stretch of the toolbar's edge from the panel's top edge,
  // which stands the inset above the trigger, to the toolbar's end.
  const toEnd =
    host.getBoundingClientRect().bottom -
    control.getBoundingClientRect().top +
    inset;

  // A panel yet to render is taken to reach the toolbar's end. The
  // height is read as laid out: the popup animates in scaled, and a
  // rect would report the scaled height.
  const panelHeight = panel?.offsetHeight ?? toEnd;
  const reachesEnd = panelHeight >= toEnd;

  return {
    inset,
    sideOffset: padding,
    // The panel covers the toolbar's edge as far as it reaches
    length: reachesEnd ? toEnd : panelHeight,
    flushStart: resolveHostControls(host).indexOf(control) === 0,
    reachesEnd,
  };
}

/**
 * Resolves the toolbar controls an open panel runs alongside: those
 * other than the trigger standing within the stretch of the
 * toolbar's edge the panel covers.
 *
 * @param control - The panel's trigger.
 * @param host - The toolbar holding the trigger.
 * @param junction - The panel's junction with the toolbar.
 * @returns The covered controls.
 */
function resolveCoveredControls(
  control: HTMLElement,
  host: HTMLElement,
  junction: PanelJunction,
): Element[] {
  // From the trigger's own top edge, not the panel's: the panel
  // stands the inset above the trigger only to line up with the
  // toolbar, and the inset can reach into the control above.
  const top = control.getBoundingClientRect().top;
  const bottom = top - junction.inset + junction.length;

  return resolveHostControls(host).filter((other) => {
    if (other === control) {
      return false;
    }

    const rect = other.getBoundingClientRect();

    return rect.top < bottom && rect.bottom > top;
  });
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
