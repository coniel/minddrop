import React from 'react';
import { IconButton } from '@minddrop/ui-primitives';
import { useDevToolsPanels } from '../DevToolsPanelsStore';
import { openDevTools } from '../openDevTools';
import { DevToolsPanelConfig } from '../types';
import { useActiveDevToolsPanel } from '../useActiveDevToolsPanel';
import './DevToolsTabs.css';

/**
 * Renders a tab for each registered dev tools panel.
 */
export const DevToolsTabs: React.FC = () => {
  const panels = useDevToolsPanels();
  const activePanel = useActiveDevToolsPanel();

  return (
    <div className="dev-tools-tabs">
      {panels.map((panel) => (
        <DevToolsTab
          key={panel.id}
          id={panel.id}
          icon={panel.icon}
          label={panel.label}
          active={activePanel?.id === panel.id}
        />
      ))}
    </div>
  );
};

interface DevToolsTabProps {
  /**
   * ID of the panel the tab activates.
   */
  id: string;

  /**
   * Icon rendered in the tab.
   */
  icon: DevToolsPanelConfig['icon'];

  /**
   * Translation key of the panel's label.
   */
  label: DevToolsPanelConfig['label'];

  /**
   * Whether the tab's panel is active.
   */
  active: boolean;
}

/**
 * Renders a single panel tab which activates its panel when clicked.
 */
const DevToolsTab: React.FC<DevToolsTabProps> = ({
  id,
  icon,
  label,
  active,
}) => {
  const handleClick = () => {
    openDevTools(id);
  };

  return (
    <IconButton
      icon={icon}
      label={label}
      size="sm"
      active={active}
      onClick={handleClick}
    />
  );
};
