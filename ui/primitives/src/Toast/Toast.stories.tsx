/**
 * Toast.stories.tsx
 * Dev reference for the Toast component.
 */

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  useToastManager,
} from './Toast';
import { Button } from '../Button';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

interface DemoToastData {
  action?: string;
}

const DemoToasts = () => {
  const manager = useToastManager<DemoToastData>();

  return (
    <>
      {/* --------------------------------------------------------
          TYPES
      -------------------------------------------------------- */}
      <StorySection
        title="Types"
        description="Default, success, error, and warning variants with colored left border."
      >
        <StoryRow>
          <StoryItem label="default">
            <Button
              variant="outline"
              onClick={() =>
                manager.add({
                  title: 'Default toast',
                  description: 'Something happened.',
                })
              }
            >
              Show default
            </Button>
          </StoryItem>
          <StoryItem label="success">
            <Button
              variant="outline"
              onClick={() =>
                manager.add({
                  type: 'success',
                  title: 'Success',
                  description: 'Changes saved successfully.',
                })
              }
            >
              Show success
            </Button>
          </StoryItem>
          <StoryItem label="error">
            <Button
              variant="outline"
              onClick={() =>
                manager.add({
                  type: 'error',
                  title: 'Error',
                  description: 'Something went wrong.',
                })
              }
            >
              Show error
            </Button>
          </StoryItem>
          <StoryItem label="warning">
            <Button
              variant="outline"
              onClick={() =>
                manager.add({
                  type: 'warning',
                  title: 'Warning',
                  description: 'This action cannot be undone.',
                })
              }
            >
              Show warning
            </Button>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          TITLE ONLY
      -------------------------------------------------------- */}
      <StorySection
        title="Title only"
        description="A minimal toast with just a title and close button."
      >
        <StoryRow>
          <StoryItem>
            <Button
              variant="outline"
              onClick={() => manager.add({ title: 'Item deleted' })}
            >
              Show title only
            </Button>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          WITH ACTION
      -------------------------------------------------------- */}
      <StorySection
        title="With action"
        description="Toasts can include an action button alongside the close button."
      >
        <StoryRow>
          <StoryItem>
            <Button
              variant="outline"
              onClick={() =>
                manager.add({
                  title: 'Item deleted',
                  description: 'The item was moved to trash.',
                  data: { action: 'Undo' },
                })
              }
            >
              Show with action
            </Button>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          STACKING
      -------------------------------------------------------- */}
      <StorySection
        title="Stacking"
        description="Multiple toasts stack in the viewport. Default limit is 3."
      >
        <StoryRow>
          <StoryItem>
            <Button
              variant="outline"
              onClick={() => {
                manager.add({ title: 'First toast', type: 'success' });
                manager.add({ title: 'Second toast', type: 'warning' });
                manager.add({ title: 'Third toast', type: 'error' });
              }}
            >
              Show 3 toasts
            </Button>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* Render area for toasts */}
      <ToastViewport>
        {manager.toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} type={toast.type as any}>
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
              {toast.data?.action && (
                <ToastAction altText={toast.data.action}>
                  {toast.data.action}
                </ToastAction>
              )}
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastViewport>
    </>
  );
};

export const ToastStories = () => (
  <Story title="Toast">
    <ToastProvider>
      <DemoToasts />
    </ToastProvider>
  </Story>
);
