/**
 * ConfirmationDialog.stories.tsx
 * Dev reference for the ConfirmationDialog component.
 */

import { useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { Button } from '../Button';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const ConfirmationDialogStories = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <Story title="ConfirmationDialog">

      {/* --------------------------------------------------------
          BASIC
          Standard confirmation — neutral confirm button.
      -------------------------------------------------------- */}
      <StorySection title="Basic" description="Built on Base UI AlertDialog. Blocks interaction with the rest of the page until dismissed.">
        <StoryRow>
          <StoryItem label="open dialog">
            <Button variant="outline" onClick={() => setBasicOpen(true)}>
              Open
            </Button>
            <ConfirmationDialog
              open={basicOpen}
              onOpenChange={setBasicOpen}
              title="Save changes?"
              message="Your unsaved changes will be lost if you leave without saving."
              confirmLabel="Save"
              onConfirm={() => {
                setLastAction('confirmed');
                setBasicOpen(false);
              }}
              onCancel={() => {
                setLastAction('cancelled');
                setBasicOpen(false);
              }}
            />
            {lastAction && (
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                → {lastAction}
              </span>
            )}
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          DANGER
          Destructive action — confirm button uses danger styling.
      -------------------------------------------------------- */}
      <StorySection title="Danger" description="Pass danger to style the confirm button as a destructive action.">
        <StoryRow>
          <StoryItem label="destructive">
            <Button variant="outline" onClick={() => setDangerOpen(true)}>
              Delete item
            </Button>
            <ConfirmationDialog
              open={dangerOpen}
              onOpenChange={setDangerOpen}
              title="Delete this item?"
              message="This action cannot be undone. The item will be permanently removed."
              confirmLabel="Delete"
              danger
              onConfirm={() => setDangerOpen(false)}
              onCancel={() => setDangerOpen(false)}
            />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          CUSTOM CONTENT
          title and message accept React nodes for richer content.
      -------------------------------------------------------- */}
      <StorySection title="Custom content" description="title and message accept React nodes when a plain string isn't enough.">
        <StoryRow>
          <StoryItem label="rich content">
            <Button variant="outline" onClick={() => setCustomOpen(true)}>
              Open
            </Button>
            <ConfirmationDialog
              open={customOpen}
              onOpenChange={setCustomOpen}
              title={
                <span>
                  Remove <strong>Project Alpha</strong>?
                </span>
              }
              message={
                <span>
                  This will permanently delete the project and all{' '}
                  <strong>24 associated files</strong>. This cannot be undone.
                </span>
              }
              confirmLabel="Remove project"
              cancelLabel="Keep it"
              danger
              onConfirm={() => setCustomOpen(false)}
              onCancel={() => setCustomOpen(false)}
            />
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
