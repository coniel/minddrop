import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import React from 'react';
import { IconProp, IconRenderer } from '../IconRenderer';
import { propsToClass } from '../utils';
import './Tabs.css';

/* ============================================================
   ROOT
   ============================================================ */

export type TabsProps = TabsPrimitive.Root.Props;

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...other }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      className={`tabs${className ? ` ${className}` : ''}`}
      {...other}
    />
  ),
);

Tabs.displayName = 'Tabs';

/* ============================================================
   LIST
   ============================================================ */

export type TabsListProps = TabsPrimitive.List.Props;

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...other }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={`tabs-list${className ? ` ${className}` : ''}`}
      {...other}
    />
  ),
);

TabsList.displayName = 'TabsList';

/* ============================================================
   TAB
   ============================================================ */

export type TabsTabSize = 'sm' | 'md' | 'lg';

export interface TabsTabProps extends TabsPrimitive.Tab.Props {
  /**
   * Icon placed before the label.
   */
  startIcon?: IconProp;

  /**
   * Size of the tab.
   * @default 'md'
   */
  size?: TabsTabSize;
}

export const TabsTab = React.forwardRef<HTMLButtonElement, TabsTabProps>(
  ({ startIcon, size = 'md', children, className, ...other }, ref) => {
    // Build class string with size and startIcon modifiers
    const classes = propsToClass('tabs-tab', {
      size,
      startIcon: Boolean(startIcon) || undefined,
      className: typeof className === 'string' ? className : undefined,
    });

    return (
      <TabsPrimitive.Tab ref={ref} className={classes} {...other}>
        <IconRenderer icon={startIcon} className="icon" />
        {children}
      </TabsPrimitive.Tab>
    );
  },
);

TabsTab.displayName = 'TabsTab';

/* ============================================================
   PANEL
   ============================================================ */

export type TabsPanelProps = TabsPrimitive.Panel.Props;

export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ className, ...other }, ref) => (
    <TabsPrimitive.Panel
      ref={ref}
      className={`tabs-panel${className ? ` ${className}` : ''}`}
      {...other}
    />
  ),
);

TabsPanel.displayName = 'TabsPanel';

/* ============================================================
   INDICATOR
   ============================================================ */

export type TabsIndicatorProps = TabsPrimitive.Indicator.Props;

export const TabsIndicator = React.forwardRef<
  HTMLSpanElement,
  TabsIndicatorProps
>(({ className, ...other }, ref) => (
  <TabsPrimitive.Indicator
    ref={ref}
    className={`tabs-indicator${className ? ` ${className}` : ''}`}
    {...other}
  />
));

TabsIndicator.displayName = 'TabsIndicator';
