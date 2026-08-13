import React from 'react';
import { ValueRow } from './ValueRow';

/**
 * Renders the shadow scale and its semantic aliases.
 */
export const ElevationSection: React.FC = () => (
  <div className="dev-tools-tokens-section">
    <h3 className="dev-tools-tokens-heading">Shadows</h3>

    <div className="dev-tools-tokens-group dev-tools-tokens-elevation">
      {Shadows.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <div
              className="dev-tools-tokens-shadow-box"
              style={{ boxShadow: `var(${step.token})` }}
            />
          }
        />
      ))}
    </div>
  </div>
);

/**
 * The shadow scale and semantic aliases.
 */
const Shadows = [
  { token: '--shadow-xs', note: 'thumbs, small handles' },
  { token: '--shadow-sm', note: 'subtle lift' },
  { token: '--shadow-md', note: 'cards, panels' },
  { token: '--shadow-lg', note: 'floating content' },
  { token: '--shadow-raised', note: 'alias of --shadow-md' },
  { token: '--shadow-overlay', note: 'alias of --shadow-lg' },
];
