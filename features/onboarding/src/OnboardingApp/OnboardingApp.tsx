import { useCallback, useEffect, useState } from 'react';
import { Fs } from '@minddrop/file-system';
import { TranslationKey } from '@minddrop/i18n';
import { EmojiSkinTone, IconsProvider } from '@minddrop/ui-icons';
import {
  Button,
  Heading,
  MindDropLogo,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { Workspaces } from '@minddrop/workspaces';
import { CreateWorkspaceForm } from '../CreateWorkspaceForm';
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
  // The onboarding window does not persist app config, so the skin tone
  // selected in the icon picker lasts only as long as the window
  const [emojiSkinTone, setEmojiSkinTone] = useState<EmojiSkinTone>(0);

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

  const openWorkspaceFolder = useCallback(async () => {
    setError(null);

    // Ask the user to select a workspace folder
    const path = await Fs.openFilePicker({ directory: true });

    // Do nothing if the picker was cancelled
    if (typeof path !== 'string') {
      return;
    }

    // Only existing workspaces can be opened, as a folder of files is
    // not usable as content until it has been set up as a workspace
    if (!(await Workspaces.isWorkspace(path))) {
      setError('onboarding.errors.notAWorkspace');

      return;
    }

    try {
      // Add the workspace
      await Workspaces.add(path);
    } catch {
      setError('onboarding.errors.unknown');

      return;
    }

    onComplete();
  }, [onComplete]);

  // Render nothing until initialization has completed
  if (!initialized) {
    return null;
  }

  return (
    <IconsProvider
      defaultEmojiSkinTone={emojiSkinTone}
      onDefaultEmojiSkinToneChange={setEmojiSkinTone}
    >
      <div className="onboarding-app">
        {/* Allows the frameless window to be dragged */}
        <div className="onboarding-drag-handle electrobun-webkit-app-region-drag" />
        <Stack className="onboarding-content" gap={5} align="center">
          {creatingWorkspace ? (
            <CreateWorkspaceForm
              onBack={stopCreatingWorkspace}
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
                  onClick={openWorkspaceFolder}
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
