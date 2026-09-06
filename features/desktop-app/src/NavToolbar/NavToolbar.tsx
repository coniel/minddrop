import { FC, useCallback, useLayoutEffect, useState } from 'react';
import { Events, SetNavToolbarBackActionEventData } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import './NavToolbar.css';

/**
 * Standalone top-left toolbar holding the back/forward navigation
 * buttons, aligned with the macOS window controls. Sizes itself to a
 * width dispatched via Events.events.SetNavToolbarWidth (typically the width of
 * the active left panel), collapsing to auto width when the width is 0.
 */
export const NavToolbar: FC = () => {
  const [width, setWidth] = useState(0);
  // The view-provided back action overriding the tab history
  // navigation, when one is registered
  const [backAction, setBackAction] =
    useState<SetNavToolbarBackActionEventData>(null);

  // Whether the active tab has history to navigate to
  const canGoBack = Tabs.useCanGoBack(Views.constants.DefaultAreaId);
  const canGoForward = Tabs.useCanGoForward(Views.constants.DefaultAreaId);

  // Registered as a layout effect so the width is in place before the
  // first paint, catching the sidebar's initial width dispatch
  useLayoutEffect(() => {
    Events.addListener(
      Events.events.SetNavToolbarWidth,
      'app-nav-toolbar',
      (data) => {
        setWidth(data.width);
      },
    );

    // Views register a back action of their own, e.g. an editor
    // backing out to its dashboard
    Events.addListener(
      Events.events.SetNavToolbarBackAction,
      'app-nav-toolbar',
      (data) => {
        setBackAction(data);
      },
    );

    return () => {
      Events.removeListener(
        Events.events.SetNavToolbarWidth,
        'app-nav-toolbar',
      );
      Events.removeListener(
        Events.events.SetNavToolbarBackAction,
        'app-nav-toolbar',
      );
    };
  }, []);

  // Run the overriding back action, or navigate the active tab
  // back through its history
  const handleClickBack = useCallback(() => {
    if (backAction) {
      Events.dispatch(Events.events.NavToolbarBack);

      return;
    }

    Tabs.goBack(Views.constants.DefaultAreaId);
  }, [backAction]);

  // Navigate the active tab forward through its history
  const handleClickForward = useCallback(() => {
    Tabs.goForward(Views.constants.DefaultAreaId);
  }, []);

  return (
    <div className="app-nav-toolbar" style={width > 0 ? { width } : undefined}>
      <Toolbar className="electrobun-webkit-app-region-no-drag">
        <ToolbarIconButton
          icon="chevron-left"
          label={backAction?.label ?? 'navigation.back'}
          tooltip={{ title: backAction?.label ?? 'navigation.back' }}
          size="sm"
          disabled={!backAction && !canGoBack}
          onClick={handleClickBack}
        />
        <ToolbarIconButton
          icon="chevron-right"
          label="navigation.forward"
          tooltip={{ title: 'navigation.forward' }}
          size="sm"
          disabled={!canGoForward}
          onClick={handleClickForward}
        />
      </Toolbar>
    </div>
  );
};
