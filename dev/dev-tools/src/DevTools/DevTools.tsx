import React, { useEffect, useReducer, useState } from 'react';
import {
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  Text,
} from '@minddrop/ui-primitives';
import { stories } from '@minddrop/ui-primitives/stories';
import { DevToolsPlaceholder } from '../DevToolsPlaceholder';
import { LogsPanel } from '../LogsPanel';
import { ActiveSection, ActiveStory } from '../types';
import {
  installConsoleInterceptors,
  logsReducer,
  setLogListener,
} from '../utils';
import './DevTools.css';

export const DevTools: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('logs');
  const [activeStory, setActiveStory] = useState<ActiveStory>({
    groupIndex: 0,
    itemIndex: 0,
  });
  const [logs, dispatch] = useReducer(logsReducer, []);

  // Install console interceptors on first render
  useEffect(() => {
    installConsoleInterceptors();

    setLogListener((entry) => {
      dispatch({ type: 'add', entry });
    });

    return () => {
      setLogListener(null);
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'd') {
        e.preventDefault();
        setVisible((v) => !v);
      }

      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  if (!visible) return null;

  const group = stories[activeStory.groupIndex];
  const ActiveStoryComponent = group?.items[activeStory.itemIndex]?.component;

  return (
    <div className="dev-tools-overlay">
      <div className="dev-tools">
        {/* --- Sidebar --- */}
        <aside className="dev-tools-sidebar">
          <div className="dev-tools-sidebar-header">
            <Text size="sm" weight="semibold">
              DevTools
            </Text>
            <Text size="xs" color="subtle" mono>
              d / esc
            </Text>
          </div>

          <div className="dev-tools-section-tabs">
            <IconButton
              icon="terminal"
              label="Logs"
              size="sm"
              active={activeSection === 'logs'}
              onClick={() => setActiveSection('logs')}
            />
            <IconButton
              icon="database"
              label="State"
              size="sm"
              active={activeSection === 'state'}
              onClick={() => setActiveSection('state')}
            />
            <IconButton
              icon="zap"
              label="Events"
              size="sm"
              active={activeSection === 'events'}
              onClick={() => setActiveSection('events')}
            />
            <IconButton
              icon="book-open"
              label="Stories"
              size="sm"
              active={activeSection === 'stories'}
              onClick={() => setActiveSection('stories')}
            />
          </div>

          <nav className="dev-tools-nav">
            {activeSection === 'stories' && (
              <>
                {stories.map((group, groupIndex) => (
                  <MenuGroup key={group.group} padded>
                    <MenuLabel label={group.group} />
                    {group.items.map((item, itemIndex) => (
                      <MenuItem
                        key={item.label}
                        label={item.label}
                        size="compact"
                        active={
                          activeStory.groupIndex === groupIndex &&
                          activeStory.itemIndex === itemIndex
                        }
                        onClick={() =>
                          setActiveStory({ groupIndex, itemIndex })
                        }
                      />
                    ))}
                  </MenuGroup>
                ))}
              </>
            )}
          </nav>
        </aside>

        {/* --- Content --- */}
        <main className="dev-tools-content">
          {activeSection === 'stories' && ActiveStoryComponent && (
            <div className="dev-tools-story">
              <ActiveStoryComponent />
            </div>
          )}

          {activeSection === 'state' && (
            <DevToolsPlaceholder
              icon="database"
              title="State inspector"
              description="Import and register your state stores to inspect them here."
            />
          )}

          {activeSection === 'events' && (
            <DevToolsPlaceholder
              icon="zap"
              title="Event log"
              description="Add a catch-all listener to your event bus to stream events here."
            />
          )}

          {activeSection === 'logs' && (
            <LogsPanel
              logs={logs}
              onClear={() => dispatch({ type: 'clear' })}
            />
          )}
        </main>
      </div>
    </div>
  );
};
