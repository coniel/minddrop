import { useCallback, useEffect, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { IconsProvider } from '@minddrop/ui-icons';
import {
  Button,
  Heading,
  MindDropLogo,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import {
  CreateWorkspaceForm,
  useOpenWorkspaceFolder,
} from '@minddrop/ui-workspaces';
import { initializeOnboardingApp } from '../initializeOnboardingApp';
import './OnboardingApp.css';

export interface OnboardingAppProps {
  /**
   * Callback fired once a workspace has been set up.
   */
  onComplete: () => void;
}

/**
 * Renders the onboarding window contents: a welcome screen from which
 * the user creates a new workspace or opens an existing folder.
 */
export const OnboardingApp: React.FC<OnboardingAppProps> = ({ onComplete }) => {
  const [initialized, setInitialized] = useState(false);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [error, setError] = useState<TranslationKey | null>(null);
  const openWorkspaceFolder = useOpenWorkspaceFolder({ onError: setError });

  // Initialize the onboarding app on mount
  useEffect(() => {
    async function init() {
      await initializeOnboardingApp();

      setInitialized(true);
    }

    init();
  }, []);

  const startCreatingWorkspace = useCallback(() => {
    setError(null);
    setCreatingWorkspace(true);
  }, []);

  const stopCreatingWorkspace = useCallback(() => {
    setCreatingWorkspace(false);
  }, []);

  const addWorkspaceFolder = useCallback(async () => {
    setError(null);

    const workspace = await openWorkspaceFolder();

    // Stay on the welcome screen if the picker was cancelled or the
    // selected folder could not be opened.
    if (!workspace) {
      return;
    }

    onComplete();
  }, [openWorkspaceFolder, onComplete]);

  // Render nothing until initialization has completed
  if (!initialized) {
    return null;
  }

  return (
    <IconsProvider>
      <div className="onboarding-app">
        {/* Allows the frameless window to be dragged */}
        <div className="onboarding-drag-handle electrobun-webkit-app-region-drag" />
        <Stack className="onboarding-content" gap={5} align="center">
          {creatingWorkspace ? (
            <CreateWorkspaceForm
              cancelLabel="actions.back"
              onCancel={stopCreatingWorkspace}
              onCreated={onComplete}
            />
          ) : (
            <>
              <MindDropLogo size={96} />
              <Stack gap={2} align="center">
                <Heading as="h1" size="xl" text="onboarding.welcome.title" />
                <Text
                  paragraph
                  color="muted"
                  className="onboarding-description"
                  text="onboarding.welcome.description"
                />
              </Stack>
              <Stack gap={2} className="onboarding-actions">
                <Button
                  variant="solid"
                  color="primary"
                  size="lg"
                  startIcon="folder-plus"
                  label="onboarding.welcome.actions.create"
                  onClick={startCreatingWorkspace}
                />
                <Button
                  variant="filled"
                  size="lg"
                  startIcon="folder-open"
                  label="onboarding.welcome.actions.open"
                  onClick={addWorkspaceFolder}
                />
              </Stack>
              {/* Only rendered when adding a folder failed */}
              {error && <Text color="danger" text={error} />}
            </>
          )}
        </Stack>
      </div>
    </IconsProvider>
  );
};
