import React from 'react';
import { propsToClass } from '../utils';
import './WebView.css';

export interface WebViewProps
  extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  /**
   * Space-separated list of sandbox permissions applied to the iframe.
   * @default 'allow-scripts allow-same-origin allow-popups allow-forms'
   */
  sandbox?: string;
}

/**
 * Renders a web page inside an iframe with sensible security defaults.
 */
export const WebView = React.forwardRef<HTMLIFrameElement, WebViewProps>(
  (
    {
      className,
      sandbox = 'allow-scripts allow-same-origin allow-popups allow-forms',
      ...other
    },
    ref,
  ) => {
    // Build the class string
    const classes = propsToClass('webview', { className });

    return (
      <iframe ref={ref} className={classes} sandbox={sandbox} {...other} />
    );
  },
);

WebView.displayName = 'WebView';
