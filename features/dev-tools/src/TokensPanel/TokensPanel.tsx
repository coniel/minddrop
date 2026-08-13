import React, { useState } from 'react';
import { MenuGroup, MenuItem, MenuLabel } from '@minddrop/ui-primitives';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { ColorsSection } from './ColorsSection';
import { ElevationSection } from './ElevationSection';
import { SchemesSection } from './SchemesSection';
import { SizingSection } from './SizingSection';
import { TypographySection } from './TypographySection';
import './TokensPanel.css';

/**
 * Renders the design token reference: live samples of the token
 * vocabulary, grouped into sections.
 */
export const TokensPanel: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState(Sections[0].id);

  // Fall back to the first section when the ID has no match
  const activeSection =
    Sections.find((section) => section.id === activeSectionId) ?? Sections[0];
  const ActiveSection = activeSection.component;

  const sidebar = (
    <MenuGroup className="dev-tools-tokens-nav">
      <MenuLabel stringLabel="Sections" />

      {Sections.map((section) => (
        <MenuItem
          key={section.id}
          size="compact"
          stringLabel={section.label}
          active={section.id === activeSection.id}
          onClick={() => setActiveSectionId(section.id)}
        />
      ))}
    </MenuGroup>
  );

  return (
    <DevToolsPanelLayout sidebar={sidebar}>
      <div className="dev-tools-tokens">
        <ActiveSection />
      </div>
    </DevToolsPanelLayout>
  );
};

/**
 * The panel's sections, listed in the sidebar.
 */
const Sections = [
  { id: 'typography', label: 'Typography', component: TypographySection },
  { id: 'sizing', label: 'Sizing', component: SizingSection },
  { id: 'colors', label: 'Colors', component: ColorsSection },
  { id: 'schemes', label: 'Schemes', component: SchemesSection },
  { id: 'elevation', label: 'Elevation', component: ElevationSection },
];
