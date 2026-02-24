/**
 * Dialog.stories.tsx
 * Dev reference for the Dialog component.
 */
import { useState } from 'react';
// Note: DialogTitle and DialogDescription are direct re-exports of Base UI primitives.
// Base UI automatically applies the dialog-title and dialog-description CSS classes.
import { Button } from '../Button';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogWidth,
} from './Dialog';

const DialogDemo = ({
  title,
  description,
  label = 'Open dialog',
  width = 'md',
}: {
  title?: string;
  description?: string;
  label?: string;
  width?: DialogWidth;
}) => (
  <DialogRoot>
    <DialogTrigger render={<Button variant="filled">{label}</Button>} />
    <Dialog width={width}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && <DialogDescription>{description}</DialogDescription>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-4)',
        }}
      >
        <DialogClose render={<Button variant="filled">Cancel</Button>} />
        <DialogClose
          render={
            <Button variant="solid" color="primary">
              Confirm
            </Button>
          }
        />
      </div>
    </Dialog>
  </DialogRoot>
);

export const DialogStories = () => (
  <Story title="Dialog">
    {/* --------------------------------------------------------
        BASIC
        The Dialog component composes Backdrop and Popup together.
        Always wrap with DialogRoot and trigger with DialogTrigger.
    -------------------------------------------------------- */}
    <StorySection
      title="Basic"
      description="Dialog composes backdrop and popup. Always pair with DialogRoot and DialogTrigger."
    >
      <StoryRow>
        <StoryItem label="title only">
          <DialogDemo title="Confirm action" />
        </StoryItem>
        <StoryItem label="title + description">
          <DialogDemo
            title="Delete workspace"
            description="This will permanently delete the workspace and all its contents. This action cannot be undone."
          />
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        WIDTHS
        Three widths to fit different content densities. sm for
        confirmations, md for standard dialogs, lg for complex
        forms.
    -------------------------------------------------------- */}
    <StorySection
      title="Widths"
      description="Three widths for different content densities. sm for confirmations, md for standard dialogs, lg for complex forms."
    >
      <StoryRow>
        <StoryItem label="sm">
          <DialogDemo width="sm" title="Confirm?" label="sm" />
        </StoryItem>
        <StoryItem label="md (default)">
          <DialogDemo width="md" title="Edit settings" label="md" />
        </StoryItem>
        <StoryItem label="lg">
          <DialogDemo width="lg" title="Import data" label="lg" />
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DANGER
        Destructive dialogs use a danger solid button as the
        primary action and should always have a description
        explaining what will be deleted or lost.
    -------------------------------------------------------- */}
    <StorySection
      title="Danger"
      description="Destructive actions should always include a description and use a danger solid button as the primary action."
    >
      <StoryRow>
        <StoryItem label="destructive">
          <DialogRoot>
            <DialogTrigger
              render={
                <Button variant="filled" danger="always">
                  Delete
                </Button>
              }
            />
            <Dialog width="sm">
              <DialogTitle>Delete permanently?</DialogTitle>
              <DialogDescription>
                This will permanently delete "Project Alpha" and all its
                contents. This action cannot be undone.
              </DialogDescription>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--space-2)',
                }}
              >
                <DialogClose
                  render={<Button variant="filled">Cancel</Button>}
                />
                <DialogClose
                  render={
                    <Button variant="solid" color="danger">
                      Delete
                    </Button>
                  }
                />
              </div>
            </Dialog>
          </DialogRoot>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        CUSTOM CONTENT
        Dialog accepts any children. Title and Description are
        optional — omit them for fully custom layouts.
    -------------------------------------------------------- */}
    <StorySection
      title="Custom content"
      description="Title and Description are optional. Dialog accepts any children for fully custom layouts."
    >
      <StoryRow>
        <StoryItem label="custom layout">
          <DialogRoot>
            <DialogTrigger
              render={<Button variant="filled">Open custom</Button>}
            />
            <Dialog>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <DialogTitle>Rename document</DialogTitle>
                <input
                  placeholder="Document name"
                  defaultValue="Project Alpha"
                  style={{
                    width: '100%',
                    height: '1.75rem',
                    padding: '0 var(--space-3)',
                    boxSizing: 'border-box',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--surface-neutral)',
                    color: 'var(--text-regular)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-2)',
                  }}
                >
                  <DialogClose
                    render={<Button variant="filled">Cancel</Button>}
                  />
                  <DialogClose
                    render={
                      <Button variant="solid" color="primary">
                        Rename
                      </Button>
                    }
                  />
                </div>
              </div>
            </Dialog>
          </DialogRoot>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
