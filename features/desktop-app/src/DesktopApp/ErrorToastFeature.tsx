import React, { useEffect } from 'react';
import { AppErrorEventData, Events } from '@minddrop/events';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastType,
  ToastViewport,
  useToastManager,
} from '@minddrop/ui-primitives';

/**
 * Displays an error toast for each dispatched app error event.
 */
export const ErrorToastFeature: React.FC = () => {
  const manager = useToastManager<AppErrorEventData>();

  useEffect(() => {
    // Show an error toast for each dispatched app error
    Events.addListener(Events.events.AppError, 'desktop-app', (data) => {
      // Keep error toasts visible until dismissed manually
      manager.add({ type: 'error', timeout: 0, data });
    });

    return () => {
      Events.removeListener(Events.events.AppError, 'desktop-app');
    };
  }, [manager]);

  return (
    <ToastViewport>
      {manager.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} type={resolveToastType(toast.type)}>
          <div>
            {/* Only render a title when the error has one */}
            {toast.data?.title && <ToastTitle>{toast.data.title}</ToastTitle>}
            {toast.data?.message && (
              <ToastDescription>{toast.data.message}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </ToastViewport>
  );
};

// Coerces a toast's free-form type string to a known toast type
function resolveToastType(type?: string): ToastType {
  if (type === 'success' || type === 'error' || type === 'warning') {
    return type;
  }

  return 'default';
}
