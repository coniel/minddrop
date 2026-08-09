import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import { DesignStudioStore } from '../DesignStudioStore';
import { cleanup, element_text_1, setup } from '../test-utils';
import { ElementContentSection } from './ElementContentSection';

describe('<ElementContentSection />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the content mode toggle when property binding is enabled', () => {
    render(<ElementContentSection elementId={element_text_1.id} />);

    // Both content modes are offered ("Property" also appears as
    // the property field label, so match all occurrences)
    expect(
      screen.getAllByText('designs.content.mode.property').length,
    ).toBeGreaterThan(0);
    screen.getByText('designs.content.mode.static');
  });

  it('renders only the static content field when property binding is disabled', () => {
    // Disable property binding for the session
    DesignStudioStore.useStore.setState({ propertyBindingEnabled: false });

    render(<ElementContentSection elementId={element_text_1.id} />);

    // The mode toggle and property branch are hidden
    expect(screen.queryByText('designs.content.mode.property')).toBeNull();

    // The static content input is shown
    screen.getByRole('textbox');
  });
});
