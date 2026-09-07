import { FC } from 'react';
import { SlotClaim, SlotFillKind, ViewSessions, Views } from '@minddrop/views';

export interface SlotProps {
  /**
   * The id of the slot, which is the kind of fill it renders.
   */
  id: SlotFillKind;

  /**
   * What to render when the active session claims nothing for the
   * slot, or claims a fill which is not registered: a claim naming
   * the fill and its props, or the id of a fill taking no props.
   * Without a fallback the slot renders nothing.
   */
  fallback?: SlotClaim | string;
}

/**
 * Renders the fill claimed for a shell slot by the active session of
 * the surrounding view area (the main one outside of a view pane),
 * falling back to the given fill when it claims none.
 */
export const Slot: FC<SlotProps> = ({ id, fallback }) => {
  const pane = Views.useViewPane();
  const viewAreaId = pane?.viewAreaId ?? Views.constants.DefaultAreaId;
  const session = ViewSessions.useActive(viewAreaId);
  const fills = Views.useFills(id);

  // The session's claim on the slot, and the fallback in claim form
  const claim = session?.slots?.[id] ?? null;
  const fallbackClaim = toClaim(fallback);

  // Resolve the claimed fill, falling back when it is unregistered
  const claimedFill = claim
    ? fills.find((fill) => fill.id === claim.fill)
    : undefined;
  const resolved = claimedFill
    ? { fill: claimedFill, props: claim?.props }
    : resolveFallback(fills, fallbackClaim);

  // Nothing to render without a fill
  if (!resolved) {
    return null;
  }

  return <resolved.fill.component {...resolved.props} />;
};

/**
 * Normalises a fallback into a claim, so that the session's claim and
 * the fallback resolve through one path.
 */
function toClaim(fallback: SlotClaim | string | undefined): SlotClaim | null {
  if (!fallback) {
    return null;
  }

  if (typeof fallback === 'string') {
    return { fill: fallback };
  }

  return fallback;
}

/**
 * Resolves the fallback claim's fill among the registered fills.
 */
function resolveFallback(
  fills: { id: string; component: React.ComponentType<unknown> }[],
  fallback: SlotClaim | null,
): { fill: (typeof fills)[number]; props?: Record<string, unknown> } | null {
  if (!fallback) {
    return null;
  }

  const fill = fills.find((registered) => registered.id === fallback.fill);

  if (!fill) {
    return null;
  }

  return { fill, props: fallback.props };
}
