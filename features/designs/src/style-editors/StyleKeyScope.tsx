import React, { createContext, useContext } from 'react';

// Typography style keys that can be scoped to a prefixed style
// group
type ScopableStyleKey =
  | 'font-family'
  | 'font-weight'
  | 'font-size'
  | 'line-height'
  | 'letter-spacing'
  | 'underline'
  | 'italic'
  | 'color'
  | 'opacity'
  | 'text-align'
  | 'margin-bottom';

// The available style key scopes
type StyleKeyScopeValue = 'title';

// Use nullable context so fields work without a scope
const StyleKeyScopeContext = createContext<StyleKeyScopeValue | null>(null);

export interface StyleKeyScopeProps {
  /**
   * The scope prefix applied to descendant fields' style keys.
   */
  scope: StyleKeyScopeValue;

  /**
   * The scoped style editor fields.
   */
  children: React.ReactNode;
}

/**
 * Scopes the style keys of descendant style editor fields to a
 * prefixed style group (e.g. the editor element's title
 * typography styles).
 */
export const StyleKeyScope: React.FC<StyleKeyScopeProps> = ({
  scope,
  children,
}) => (
  <StyleKeyScopeContext.Provider value={scope}>
    {children}
  </StyleKeyScopeContext.Provider>
);

/**
 * Resolves a typography style key against the current style key
 * scope: the key untouched outside a scope, the scope prefixed
 * key inside one.
 */
export function useScopedStyleKey<TKey extends ScopableStyleKey>(
  key: TKey,
): TKey | `title-${TKey}` {
  const scope = useContext(StyleKeyScopeContext);

  // Outside a scope, keys resolve to themselves
  if (!scope) {
    return key;
  }

  return `${scope}-${key}`;
}
