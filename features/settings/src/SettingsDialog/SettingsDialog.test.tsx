import { afterEach, beforeEach, describe, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SettingsViews } from '@minddrop/settings';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { OpenSettingsEvent } from '../events';
import { cleanup } from '../test-utils';
import { SettingsDialog } from './SettingsDialog';

const designContent = 'design settings content';
const templatesContent = 'templates settings content';

describe('<SettingsDialog />', () => {
  beforeEach(() => {
    // Register two settings views to navigate between
    SettingsViews.register({
      id: 'design',
      label: 'labels.design',
      description: 'labels.properties',
      icon: 'settings',
      component: () => <div>{designContent}</div>,
    });
    SettingsViews.register({
      id: 'templates',
      label: 'labels.templates',
      description: 'labels.views',
      icon: 'settings',
      component: () => <div>{templatesContent}</div>,
    });
  });

  afterEach(cleanup);

  it('opens on the first settings view on open settings events', async () => {
    render(<SettingsDialog />);

    Events.dispatch(OpenSettingsEvent, {});

    await waitFor(() => {
      screen.getByText(designContent);
    });
  });

  it('opens on the requested settings view', async () => {
    render(<SettingsDialog />);

    Events.dispatch(OpenSettingsEvent, { view: 'templates' });

    await waitFor(() => {
      screen.getByText(templatesContent);
    });
  });

  it('switches settings view on menu item click', async () => {
    render(<SettingsDialog />);
    const user = userEvent.setup();

    Events.dispatch(OpenSettingsEvent, {});

    await waitFor(() => {
      screen.getByText(designContent);
    });

    await user.click(screen.getByText('labels.templates'));

    await waitFor(() => {
      screen.getByText(templatesContent);
    });
  });
});
