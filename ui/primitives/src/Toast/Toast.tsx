import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@minddrop/i18n';
import { propsToClass } from '../utils';
import './Toast.css';

export type ToastType = 'default' | 'success' | 'error' | 'warning';

export interface ToastProviderProps extends ToastPrimitive.Provider.Props {}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  timeout = 5000,
  limit = 3,
  children,
  ...other
}) => (
  <ToastPrimitive.Provider timeout={timeout} limit={limit} {...other}>
    {children}
  </ToastPrimitive.Provider>
);

export interface ToastViewportProps extends ToastPrimitive.Viewport.Props {}

export const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, ...other }, ref) => (
    <ToastPrimitive.Viewport
      ref={ref}
      className={['toast-viewport', className].filter(Boolean).join(' ')}
      {...other}
    />
  ),
);

ToastViewport.displayName = 'ToastViewport';

export interface ToastProps extends Omit<ToastPrimitive.Root.Props, 'className'> {
  /**
   * Visual variant of the toast.
   * @default 'default'
   */
  type?: ToastType;

  /**
   * Class name applied to the toast.
   */
  className?: string;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ children, className, type = 'default', ...other }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={propsToClass('toast', { type, className })}
      {...other}
    >
      {children}
    </ToastPrimitive.Root>
  ),
);

Toast.displayName = 'Toast';

export interface ToastTitleProps extends ToastPrimitive.Title.Props {}

export const ToastTitle = React.forwardRef<HTMLHeadingElement, ToastTitleProps>(
  ({ children, className, ...other }, ref) => {
    const { t } = useTranslation();
    const translatedChildren =
      typeof children === 'string' ? t(children) : children;

    return (
      <ToastPrimitive.Title
        ref={ref}
        className={['toast-title', className].filter(Boolean).join(' ')}
        {...other}
      >
        {translatedChildren}
      </ToastPrimitive.Title>
    );
  },
);

ToastTitle.displayName = 'ToastTitle';

export interface ToastDescriptionProps extends ToastPrimitive.Description.Props {}

export const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  ToastDescriptionProps
>(({ children, className, ...other }, ref) => {
  const { t } = useTranslation();
  const translatedChildren =
    typeof children === 'string' ? t(children) : children;

  return (
    <ToastPrimitive.Description
      ref={ref}
      className={['toast-description', className].filter(Boolean).join(' ')}
      {...other}
    >
      {translatedChildren}
    </ToastPrimitive.Description>
  );
});

ToastDescription.displayName = 'ToastDescription';

export interface ToastCloseProps extends ToastPrimitive.Close.Props {}

export const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, children, ...other }, ref) => {
    const { t } = useTranslation();

    return (
      <ToastPrimitive.Close
        ref={ref}
        className={['toast-close', className].filter(Boolean).join(' ')}
        aria-label={t('toast.close')}
        {...other}
      >
        {children ?? <X size={16} />}
      </ToastPrimitive.Close>
    );
  },
);

ToastClose.displayName = 'ToastClose';

export interface ToastActionProps extends ToastPrimitive.Action.Props {}

export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ children, className, ...other }, ref) => {
    const { t } = useTranslation();
    const translatedChildren =
      typeof children === 'string' ? t(children) : children;

    return (
      <ToastPrimitive.Action
        ref={ref}
        className={['toast-action', className].filter(Boolean).join(' ')}
        {...other}
      >
        {translatedChildren}
      </ToastPrimitive.Action>
    );
  },
);

ToastAction.displayName = 'ToastAction';

/* Re-exported primitives */
export const ToastRoot = ToastPrimitive.Root;
export const ToastPortal = ToastPrimitive.Portal;
export const ToastContent = ToastPrimitive.Content;
export const ToastPositioner = ToastPrimitive.Positioner;

/* Re-exported hooks and utilities */
export const useToastManager = ToastPrimitive.useToastManager;
export const createToastManager = ToastPrimitive.createToastManager;
