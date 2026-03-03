import Electrobun, { Electroview } from 'electrobun/view';
import { DevReviewRPC } from '../types';

// Define RPC for the renderer side
export const rpc = Electroview.defineRPC<DevReviewRPC>({
  maxRequestTime: 10000,
  handlers: {
    messages: {
      manifestsChanged: () => {
        // Dispatch a custom event that React components can listen to
        window.dispatchEvent(new CustomEvent('manifests-changed'));
      },
      plansChanged: () => {
        // Dispatch a custom event that React components can listen to
        window.dispatchEvent(new CustomEvent('plans-changed'));
      },
    },
  },
});

// Initialize Electrobun
new Electrobun.Electroview({ rpc });
