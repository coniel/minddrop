import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { OnboardingApp } from '@minddrop/feature-onboarding';
import { rpc } from './index';

// Hand over to the main app window once a workspace has been set up
function handleComplete() {
  rpc.request.onboardingComplete({});
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <OnboardingApp onComplete={handleComplete} />
  </StrictMode>,
);
