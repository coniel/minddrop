import { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
/**
 * ViewFloatingToolbar.stories.tsx
 * Dev reference for the ViewFloatingToolbar component.
 */
import { ActionMenuSwitchItem as DropdownMenuSwitchItem } from '../ActionMenuItem';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { Text } from '../Text';
import { ToolbarIconButton, ToolbarSeparator } from '../Toolbar';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { ViewFloatingToolbar } from './ViewFloatingToolbar';

// Height of the story hosts, tall enough to show the toolbar
// floating over scrolling content
const HOST_HEIGHT = 220;

// Default width of the story hosts
const HOST_WIDTH = 320;

export const ViewFloatingToolbarStories = () => (
  <Story title="ViewFloatingToolbar">
    {/* --------------------------------------------------------
        HOVER REVEAL
        The default: the toolbar sticks to the bottom of the
        scrollport and is revealed while the host is hovered.
        Hosts opt in by carrying the floating-toolbar-host class.
    -------------------------------------------------------- */}
    <StorySection
      title="Hover reveal"
      description="Sticks to the bottom center of the nearest scrollport, revealed while the host is hovered. The host must carry the floating-toolbar-host class."
    >
      <StoryRow>
        <StoryItem label="hover the panel">
          <ScrollHost hoverReveal>
            <ViewFloatingToolbar>
              <ToolbarIconButton size="lg" icon="plus" stringLabel="Add" />
              <ToolbarIconButton size="lg" icon="search" stringLabel="Search" />
            </ViewFloatingToolbar>
          </ScrollHost>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        POSITION
        Sticky toolbars scroll with the content until they reach
        the bottom of the scrollport. Absolute toolbars are
        pinned to the nearest positioned ancestor, so they stay
        put no matter how the content scrolls.
    -------------------------------------------------------- */}
    <StorySection
      title="Position"
      description="Scroll both panels: the sticky toolbar rides the scrollport, the absolute one is pinned to the container outside it."
    >
      <StoryRow>
        <StoryItem label="sticky (default)">
          <ScrollHost>
            <ViewFloatingToolbar visible>
              <ToolbarIconButton size="lg" icon="plus" stringLabel="Add" />
            </ViewFloatingToolbar>
          </ScrollHost>
        </StoryItem>
        <StoryItem label="absolute">
          <PinnedHost>
            <ViewFloatingToolbar visible position="absolute">
              <Text
                size="sm"
                color="muted"
                stringText="3 selected"
                style={{ whiteSpace: 'nowrap' }}
              />
              <ToolbarSeparator />
              <ToolbarIconButton
                size="lg"
                icon="trash-2"
                danger="on-hover"
                stringLabel="Delete"
              />
              <ToolbarIconButton size="lg" icon="x" stringLabel="Clear" />
            </ViewFloatingToolbar>
          </PinnedHost>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MENU PINNING
        The toolbar is centered on its host, so a content change
        while a menu is open would slide the menu away. Passing
        menuOpen pins the toolbar's right edge until the menu
        closes, after which it animates back to center.
    -------------------------------------------------------- */}
    <StorySection
      title="Menu pinning"
      description="Open the menu and toggle the actions: the toolbar grows leftward rather than re-centering, keeping the open menu in place. Closing the menu animates the toolbar back to center."
    >
      <StoryRow>
        <StoryItem label="menuOpen">
          <MenuPinningExample />
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

interface ScrollHostProps {
  /*
   * Whether the host reveals the toolbar on hover.
   */
  hoverReveal?: boolean;

  /*
   * Width of the host, for toolbars which need room to resize.
   */
  width?: number;

  /*
   * The toolbar to render below the host's content.
   */
  children: React.ReactNode;
}

/*
 * A scrollable panel standing in for a view, hosting a sticky
 * toolbar below content tall enough to scroll.
 */
const ScrollHost = ({
  hoverReveal,
  width = HOST_WIDTH,
  children,
}: ScrollHostProps) => (
  <div
    className={hoverReveal ? 'floating-toolbar-host' : undefined}
    style={{
      width,
      height: HOST_HEIGHT,
      overflowY: 'auto',
      padding: 'var(--space-3)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
    }}
  >
    <HostContent />
    {children}
  </div>
);

interface PinnedHostProps {
  /*
   * The toolbar to render outside the host's scrollport.
   */
  children: React.ReactNode;
}

/*
 * A positioned panel whose content scrolls independently of the
 * toolbar, standing in for a view with a pinned toolbar.
 */
const PinnedHost = ({ children }: PinnedHostProps) => (
  <div
    style={{
      position: 'relative',
      width: HOST_WIDTH,
      height: HOST_HEIGHT,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
    }}
  >
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: 'var(--space-3)',
      }}
    >
      <HostContent />
    </div>
    {children}
  </div>
);

/*
 * Filler content, tall enough to make its host scroll.
 */
const HostContent = () => (
  <>
    {Array.from({ length: 12 }, (_, index) => (
      <Text
        block
        key={index}
        color="muted"
        stringText={`Content line ${index + 1}`}
      />
    ))}
  </>
);

// The actions the pinning example's menu toggles
const TOGGLEABLE_ACTIONS = [
  { key: 'search', icon: 'search', label: 'Search' },
  { key: 'filter', icon: 'list-filter', label: 'Filter' },
  { key: 'sort', icon: 'arrow-up-down', label: 'Sort' },
] as const;

/*
 * A toolbar whose menu toggles which actions it contains, showing
 * how menuOpen keeps the open menu in place while the toolbar
 * resizes. The switch items keep the menu open, so the toolbar
 * can be resized repeatedly while watching it.
 */
const MenuPinningExample = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hiddenActions, setHiddenActions] = useState<string[]>([
    'search',
    'filter',
    'sort',
  ]);

  // Show or hide one of the toggleable actions
  function handleToggleAction(key: string, visible: boolean) {
    setHiddenActions((current) => {
      // Showing the action, drop it from the hidden list
      if (visible) {
        return current.filter((hiddenKey) => hiddenKey !== key);
      }

      return [...current, key];
    });
  }

  return (
    /* Wider than the other hosts, giving the toolbar room to grow
       while the menu is open */
    <ScrollHost width={520}>
      <ViewFloatingToolbar visible menuOpen={menuOpen}>
        <ToolbarIconButton size="lg" icon="plus" stringLabel="Add" />

        {/* The actions toggled by the menu */}
        {TOGGLEABLE_ACTIONS.filter(
          (action) => !hiddenActions.includes(action.key),
        ).map((action) => (
          <ToolbarIconButton
            size="lg"
            key={action.key}
            icon={action.icon}
            stringLabel={action.label}
          />
        ))}

        <ToolbarSeparator />
        <DropdownMenuRoot open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger>
            <ToolbarIconButton
              size="lg"
              icon="ellipsis"
              stringLabel="Options"
            />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner side="top" align="end">
              <DropdownMenuContent>
                {TOGGLEABLE_ACTIONS.map((action) => (
                  <DropdownMenuSwitchItem
                    key={action.key}
                    icon={action.icon}
                    stringLabel={action.label}
                    checked={!hiddenActions.includes(action.key)}
                    onCheckedChange={(checked) =>
                      handleToggleAction(action.key, checked)
                    }
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </ViewFloatingToolbar>
    </ScrollHost>
  );
};

registerStory({
  group: 'Layout',
  label: 'ViewFloatingToolbar',
  component: ViewFloatingToolbarStories,
});
