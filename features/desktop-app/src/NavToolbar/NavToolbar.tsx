import { FC, useLayoutEffect, useState } from 'react';
import {
  Events,
  SetNavToolbarWidthEvent,
  SetNavToolbarWidthEventData,
} from '@minddrop/events';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import './NavToolbar.css';

/**
 * Standalone top-left toolbar holding the back/forward navigation
 * buttons, aligned with the macOS window controls. Sizes itself to a
 * width dispatched via SetNavToolbarWidthEvent (typically the width of
 * the active left panel), collapsing to auto width when the width is 0.
 */
export const NavToolbar: FC = () => {
  const [width, setWidth] = useState(0);

  // Registered as a layout effect so the width is in place before the
  // first paint, catching the sidebar's initial width dispatch
  useLayoutEffect(() => {
    Events.addListener<SetNavToolbarWidthEventData>(
      SetNavToolbarWidthEvent,
      'app-nav-toolbar',
      ({ data }) => {
        setWidth(data.width);
      },
    );

    return () => {
      Events.removeListener(SetNavToolbarWidthEvent, 'app-nav-toolbar');
    };
  }, []);

  return (
    <div className="app-nav-toolbar" style={width > 0 ? { width } : undefined}>
      <Toolbar className="electrobun-webkit-app-region-no-drag">
        <ToolbarIconButton
          icon="chevron-left"
          label="navigation.back"
          tooltip={{ title: 'navigation.back' }}
          size="sm"
        />
        <ToolbarIconButton
          icon="chevron-right"
          label="navigation.forward"
          tooltip={{ title: 'navigation.forward' }}
          size="sm"
        />
      </Toolbar>
    </div>
  );
};
