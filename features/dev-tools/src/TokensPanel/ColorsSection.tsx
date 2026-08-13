import React from 'react';
import { Swatch } from './Swatch';

/**
 * Renders the color role vocabulary grouped by role family.
 */
export const ColorsSection: React.FC = () => (
  <div className="dev-tools-tokens-section">
    <h3 className="dev-tools-tokens-heading">Role vocabulary</h3>

    <p className="dev-tools-tokens-hint">
      Base roles only; interactive fills also carry hover and active variants.
    </p>

    {RoleGroups.map((group) => (
      <React.Fragment key={group.label}>
        <h4 className="dev-tools-tokens-subheading">{group.label}</h4>

        <div className="dev-tools-tokens-role-grid">
          {group.roles.map((token) => (
            <RoleChip key={token} token={token} />
          ))}
        </div>
      </React.Fragment>
    ))}
  </div>
);

interface RoleChipProps {
  /**
   * The color role token.
   */
  token: string;
}

/**
 * Renders a color role as a swatch with its token name.
 */
const RoleChip: React.FC<RoleChipProps> = ({ token }) => (
  <div className="dev-tools-tokens-role">
    <Swatch token={token} />
    <code>{token}</code>
  </div>
);

/**
 * The role vocabulary grouped by role family.
 */
const RoleGroups: { label: string; roles: string[] }[] = [
  {
    label: 'Text',
    roles: [
      '--text-regular',
      '--text-muted',
      '--text-subtle',
      '--text-placeholder',
      '--text-disabled',
      '--text-on-solid',
      '--text-primary',
      '--text-danger',
      '--text-warning',
      '--text-info',
      '--text-success',
    ],
  },
  {
    label: 'Surface',
    roles: [
      '--surface-app',
      '--surface-subtle',
      '--surface-raised',
      '--surface-overlay',
      '--surface-skeleton',
      '--surface-accent',
      '--surface-solid-accent',
      '--surface-selected',
      '--surface-primary-subtle',
      '--surface-primary',
      '--surface-danger',
      '--surface-warning',
      '--surface-info',
      '--surface-success',
      '--surface-solid-primary',
      '--surface-solid-danger',
      '--surface-solid-warning',
      '--surface-solid-info',
      '--surface-solid-success',
      '--surface-scrim',
    ],
  },
  {
    label: 'Border',
    roles: [
      '--border-subtle',
      '--border-default',
      '--border-strong',
      '--border-hover',
      '--border-selected',
      '--border-primary',
      '--border-danger',
      '--border-warning',
      '--border-info',
      '--border-success',
    ],
  },
];
