/**
 * IconButton.stories.tsx
 * Dev reference for the IconButton component.
 */
import { Button } from '../Button';
import { ContentIcon } from '../ContentIcon';
import { Select } from '../Select';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { IconButton } from './IconButton';

export const IconButtonStories = () => (
  <Story title="IconButton">
    <StorySection
      title="Variants"
      description="Mirrors Button variants minus solid. Ghost covers most toolbar use cases. Subtle is for dense panel UIs."
    >
      <StoryRow>
        <StoryItem label="ghost (default)">
          <IconButton variant="ghost" icon="settings" label="Settings" />
        </StoryItem>
        <StoryItem label="subtle">
          <IconButton variant="subtle" icon="settings" label="Settings" />
        </StoryItem>
        <StoryItem label="outline">
          <IconButton variant="outline" icon="settings" label="Settings" />
        </StoryItem>
        <StoryItem label="filled">
          <IconButton variant="filled" icon="settings" label="Settings" />
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Sizes"
      description="Heights match Button and Select exactly. Always use the same size for all controls in a toolbar row."
    >
      <StoryRow>
        <StoryItem label="sm">
          <IconButton
            variant="filled"
            size="sm"
            icon="settings"
            label="Settings"
          />
        </StoryItem>
        <StoryItem label="md (default)">
          <IconButton
            variant="filled"
            size="md"
            icon="settings"
            label="Settings"
          />
        </StoryItem>
        <StoryItem label="lg">
          <IconButton
            variant="filled"
            size="lg"
            icon="settings"
            label="Settings"
          />
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Colors"
      description="Three color roles. Neutral for standard use, muted for secondary actions, contrast for icons on dark surfaces."
    >
      <StoryRow>
        <StoryItem label="neutral (default)">
          <IconButton
            variant="ghost"
            color="neutral"
            icon="settings"
            label="Settings"
          />
        </StoryItem>
        <StoryItem label="muted">
          <IconButton
            variant="ghost"
            color="muted"
            icon="settings"
            label="Settings"
          />
        </StoryItem>
        <StoryItem label="contrast">
          <div
            style={{
              background: 'var(--surface-solid-neutral)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <IconButton
              variant="ghost"
              color="contrast"
              icon="settings"
              label="Settings"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="States"
      description="Active is for toggleable icon buttons. aria-pressed is set automatically for accessibility."
    >
      <StoryRow>
        <StoryItem label="active (ghost)">
          <IconButton variant="ghost" icon="bold" label="Bold" active />
        </StoryItem>
        <StoryItem label="active (subtle)">
          <IconButton variant="subtle" icon="bold" label="Bold" active />
        </StoryItem>
        <StoryItem label="active (filled)">
          <IconButton variant="filled" icon="bold" label="Bold" active />
        </StoryItem>
        <StoryItem label="disabled">
          <IconButton
            variant="filled"
            icon="settings"
            label="Settings"
            disabled
          />
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Tooltip"
      description="The label prop doubles as the default tooltip title. Always provide a label for accessibility."
    >
      <StoryRow>
        <StoryItem label="from label (hover me)">
          <IconButton variant="filled" icon="settings" label="Settings" />
        </StoryItem>
        <StoryItem label="custom title + description (hover me)">
          <IconButton
            variant="filled"
            icon="settings"
            label="Settings"
            tooltip={{
              title: 'Settings',
              description: 'Manage your workspace preferences',
            }}
          />
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Subtle variant — panel use"
      description="The most common control in property-editor panels. Subtle background keeps controls discoverable without visual noise."
      tinted
    >
      <StoryRow>
        <StoryItem label="alignment group">
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <IconButton
              variant="subtle"
              size="sm"
              icon="align-left"
              label="Align left"
              active
            />
            <IconButton
              variant="subtle"
              size="sm"
              icon="align-center"
              label="Align center"
            />
            <IconButton
              variant="subtle"
              size="sm"
              icon="align-right"
              label="Align right"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        CONTENT ICONS
        ContentIcon children inside IconButton. Icons with
        explicit content colors keep their color. Icons with
        current-color follow the button's color prop.
    -------------------------------------------------------- */}
    <StorySection
      title="Content icons — button colors"
      description="Content icons using current-color follow the button's color prop."
    >
      <StoryRow>
        <StoryItem label="neutral">
          <IconButton color="neutral" stringLabel="home">
            <ContentIcon
              icon="content-icon:home:default"
              color="current-color"
            />
          </IconButton>
        </StoryItem>
        <StoryItem label="muted">
          <IconButton color="muted" stringLabel="home">
            <ContentIcon
              icon="content-icon:home:default"
              color="current-color"
            />
          </IconButton>
        </StoryItem>
        <StoryItem label="primary">
          <IconButton color="primary" stringLabel="home">
            <ContentIcon
              icon="content-icon:home:default"
              color="current-color"
            />
          </IconButton>
        </StoryItem>
        <StoryItem label="danger">
          <IconButton color="danger" stringLabel="home">
            <ContentIcon
              icon="content-icon:home:default"
              color="current-color"
            />
          </IconButton>
        </StoryItem>
        <StoryItem label="contrast">
          <div
            style={{
              background: 'var(--surface-solid-neutral)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <IconButton color="contrast" stringLabel="home">
              <ContentIcon
                icon="content-icon:home:default"
                color="current-color"
              />
            </IconButton>
          </div>
        </StoryItem>
        <StoryItem label="inherit">
          <div style={{ color: 'var(--text-primary)' }}>
            <IconButton color="inherit" stringLabel="home">
              <ContentIcon
                icon="content-icon:home:default"
                color="current-color"
              />
            </IconButton>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Content icons — content colors"
      description="Content icons with explicit content colors keep their own color, unaffected by the button's color prop."
    >
      <StoryRow>
        <StoryItem label="default">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:default" color="default" />
          </IconButton>
        </StoryItem>
        <StoryItem label="blue">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:blue" color="blue" />
          </IconButton>
        </StoryItem>
        <StoryItem label="cyan">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:cyan" color="cyan" />
          </IconButton>
        </StoryItem>
        <StoryItem label="red">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:red" color="red" />
          </IconButton>
        </StoryItem>
        <StoryItem label="pink">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:pink" color="pink" />
          </IconButton>
        </StoryItem>
        <StoryItem label="purple">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:purple" color="purple" />
          </IconButton>
        </StoryItem>
        <StoryItem label="green">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:green" color="green" />
          </IconButton>
        </StoryItem>
        <StoryItem label="orange">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:orange" color="orange" />
          </IconButton>
        </StoryItem>
        <StoryItem label="yellow">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:yellow" color="yellow" />
          </IconButton>
        </StoryItem>
        <StoryItem label="brown">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:brown" color="brown" />
          </IconButton>
        </StoryItem>
        <StoryItem label="gray">
          <IconButton stringLabel="home">
            <ContentIcon icon="content-icon:home:gray" color="gray" />
          </IconButton>
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Composition"
      description="Icon buttons share heights with Button and Select for seamless toolbar rows."
    >
      <StoryRow>
        <StoryItem label="ghost toolbar">
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-1)',
              alignItems: 'center',
            }}
          >
            <IconButton variant="ghost" icon="bold" label="Bold" />
            <IconButton variant="ghost" icon="italic" label="Italic" />
            <IconButton variant="ghost" icon="underline" label="Underline" />
            <div
              style={{
                width: 1,
                height: '1rem',
                background: 'var(--border-default)',
                margin: '0 var(--space-1)',
              }}
            />
            <Select
              variant="ghost"
              size="md"
              options={[
                { label: 'Paragraph', value: 'p' },
                { label: 'Heading 1', value: 'h1' },
              ]}
              value="p"
            />
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow>
        <StoryItem label="filled toolbar">
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'center',
            }}
          >
            <Button variant="filled" startIcon="plus" size="md">
              New
            </Button>
            <IconButton
              variant="filled"
              size="md"
              icon="filter"
              label="Filter"
            />
            <IconButton
              variant="filled"
              size="md"
              icon="sort-desc"
              label="Sort"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
