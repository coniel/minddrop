/**
 * layout.stories.tsx
 * Dev reference for Flex, Group, and Stack layout primitives.
 */
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Separator } from '../Separator';
import { Text } from '../Text';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { Flex } from './Flex';
import { FlexItem } from './FlexItem';
import { Group } from './Group';
import { Stack } from './Stack';

const Box = ({ label }: { label?: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-primary)',
      border: '1px solid var(--border-primary-subtle)',
      borderRadius: 'var(--radius-sm)',
      padding: '0 var(--space-2)',
      height: '1.75rem',
      minWidth: '2rem',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-primary-muted)',
      flexShrink: 0,
    }}
  >
    {label ?? ' '}
  </div>
);

export const LayoutStories = () => (
  <Story title="Layout">
    {/* ============================================================
        GROUP
        ============================================================ */}

    {/* --------------------------------------------------------
        GROUP — BASIC
        Horizontal row with centered alignment by default.
        The main advantage over a raw div is that align: center
        and gap are handled automatically.
    -------------------------------------------------------- */}
    <StorySection
      title="Group"
      description="Horizontal row of items. align defaults to center — the key difference from raw flex. Use for toolbars, button groups, and inline compositions."
    >
      <StoryRow>
        <StoryItem label="default (gap=2, align=center)">
          <Group>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Group>
        </StoryItem>
        <StoryItem label="gap=4">
          <Group gap={4}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Group>
        </StoryItem>
        <StoryItem label="justify=between">
          <div style={{ width: 200 }}>
            <Group justify="between">
              <Box label="A" />
              <Box label="B" />
              <Box label="C" />
            </Group>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        GROUP — GROW
        Children stretch equally to fill available width.
        Useful for tab bars, segmented controls, equal-width
        button rows.
    -------------------------------------------------------- */}
    <StorySection
      title="Group — grow"
      description="grow makes all children expand equally to fill available space. Useful for equal-width button rows and tab bars."
    >
      <StoryRow>
        <StoryItem label="grow">
          <div style={{ width: 300 }}>
            <Group grow gap={2}>
              <Button variant="filled">One</Button>
              <Button variant="filled">Two</Button>
              <Button variant="filled">Three</Button>
            </Group>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        GROUP — WRAP
        Items wrap onto the next line when the container is
        too narrow. Useful for tag lists, filter chips.
    -------------------------------------------------------- */}
    <StorySection
      title="Group — wrap"
      description="wrap allows children to flow onto the next line. Useful for tag lists and filter chips."
    >
      <StoryRow>
        <StoryItem label="wrap">
          <div style={{ width: 180 }}>
            <Group wrap gap={2}>
              <Box label="Tag one" />
              <Box label="Tag two" />
              <Box label="Tag three" />
              <Box label="Tag four" />
              <Box label="Tag five" />
            </Group>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        GROUP — REAL USAGE
    -------------------------------------------------------- */}
    <StorySection
      title="Group — in use"
      description="Common patterns using Group."
    >
      <StoryRow>
        <StoryItem label="toolbar">
          <Group gap={1}>
            <IconButton variant="ghost" icon="bold" label="Bold" />
            <IconButton variant="ghost" icon="italic" label="Italic" />
            <IconButton variant="ghost" icon="underline" label="Underline" />
            <Separator orientation="vertical" margin="small" />
            <IconButton variant="ghost" icon="align-left" label="Align left" />
            <IconButton
              variant="ghost"
              icon="align-center"
              label="Align center"
            />
          </Group>
        </StoryItem>
        <StoryItem label="label + action">
          <Group justify="between">
            <Text weight="medium">Section title</Text>
            <IconButton variant="ghost" size="sm" icon="plus" label="Add" />
          </Group>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* ============================================================
        STACK
        ============================================================ */}

    {/* --------------------------------------------------------
        STACK — BASIC
        Vertical column with stretch alignment by default so
        children fill the available width.
    -------------------------------------------------------- */}
    <StorySection
      title="Stack"
      description="Vertical column. align defaults to stretch so children fill the container width. Use for forms, panels, and content sections."
    >
      <StoryRow>
        <StoryItem label="default (gap=3, align=stretch)">
          <div style={{ width: 200 }}>
            <Stack>
              <Box label="A" />
              <Box label="B" />
              <Box label="C" />
            </Stack>
          </div>
        </StoryItem>
        <StoryItem label="align=start">
          <Stack align="start">
            <Box label="Short" />
            <Box label="A longer label" />
            <Box label="Mid" />
          </Stack>
        </StoryItem>
        <StoryItem label="align=center">
          <Stack align="center">
            <Box label="Short" />
            <Box label="A longer label" />
            <Box label="Mid" />
          </Stack>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        STACK — GAP
    -------------------------------------------------------- */}
    <StorySection
      title="Stack — gap"
      description="Controls vertical spacing between children using the space token scale."
    >
      <StoryRow>
        <StoryItem label="gap=1">
          <Stack gap={1} align="start">
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </StoryItem>
        <StoryItem label="gap=3 (default)">
          <Stack gap={3} align="start">
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </StoryItem>
        <StoryItem label="gap=5">
          <Stack gap={5} align="start">
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        STACK — REAL USAGE
    -------------------------------------------------------- */}
    <StorySection
      title="Stack — in use"
      description="Common patterns using Stack."
    >
      <StoryRow>
        <StoryItem label="form fields">
          <div style={{ width: 240 }}>
            <Stack gap={3}>
              <Stack gap={1}>
                <Text size="sm" weight="medium">
                  Name
                </Text>
                <div
                  style={{
                    height: '1.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--surface-neutral)',
                  }}
                />
              </Stack>
              <Stack gap={1}>
                <Text size="sm" weight="medium">
                  Email
                </Text>
                <div
                  style={{
                    height: '1.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--surface-neutral)',
                  }}
                />
              </Stack>
              <Group justify="end" gap={2}>
                <Button variant="filled">Cancel</Button>
                <Button variant="solid" color="primary">
                  Save
                </Button>
              </Group>
            </Stack>
          </div>
        </StoryItem>
        <StoryItem label="sidebar section">
          <div style={{ width: 200 }}>
            <Stack gap={1}>
              <Group justify="between">
                <Text size="xs" weight="semibold" color="subtle">
                  PROJECTS
                </Text>
                <IconButton variant="ghost" size="sm" icon="plus" label="New" />
              </Group>
              <Stack gap={1}>
                <Button variant="ghost">Alpha</Button>
                <Button variant="subtle">Beta</Button>
                <Button variant="ghost">Gamma</Button>
              </Stack>
            </Stack>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* ============================================================
        FLEX — BASE PRIMITIVE
        ============================================================ */}

    {/* --------------------------------------------------------
        FLEX — BASIC
        The base primitive. Prefer Group or Stack in most cases —
        use Flex directly when you need direction control or
        non-standard wrap behaviour.
    -------------------------------------------------------- */}
    <StorySection
      title="Flex"
      description="The base primitive. Prefer Group or Stack — use Flex directly when you need explicit direction control or wrap-reverse."
    >
      <StoryRow>
        <StoryItem label="direction=row">
          <Flex direction="row" gap={2}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Flex>
        </StoryItem>
        <StoryItem label="direction=column">
          <Flex direction="column" gap={2} align="start">
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Flex>
        </StoryItem>
        <StoryItem label="wrap=wrap">
          <div style={{ width: 140 }}>
            <Flex wrap="wrap" gap={2}>
              <Box label="A" />
              <Box label="B" />
              <Box label="C" />
              <Box label="D" />
              <Box label="E" />
            </Flex>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* ============================================================
        FLEX ITEM
        ============================================================ */}

    {/* --------------------------------------------------------
        FLEX ITEM
        Child wrapper for overriding flex behaviour on a single
        item. Use marginAuto to push items around, grow to fill
        space, shrink to prevent squishing, alignSelf to break
        out of the parent's alignment.
    -------------------------------------------------------- */}
    <StorySection
      title="FlexItem"
      description="Wraps a single child to override its flex behaviour without touching the parent. Most commonly used for marginAuto pushing."
    >
      <StoryRow>
        <StoryItem label="marginAuto=left (push to end)">
          <div
            style={{
              width: 300,
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
            }}
          >
            <Group>
              <Text size="sm" weight="medium">
                Title
              </Text>
              <FlexItem marginAuto="left">
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon="more-horizontal"
                  label="More"
                />
              </FlexItem>
            </Group>
          </div>
        </StoryItem>
        <StoryItem label="marginAuto=x (center one item)">
          <div
            style={{
              width: 300,
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
            }}
          >
            <Group>
              <Button variant="ghost" size="sm">
                Back
              </Button>
              <FlexItem marginAuto="x">
                <Text size="sm" weight="medium">
                  Page title
                </Text>
              </FlexItem>
              <Button variant="ghost" size="sm">
                Next
              </Button>
            </Group>
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow>
        <StoryItem label="grow=1 (fill space)">
          <div
            style={{
              width: 300,
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
            }}
          >
            <Group gap={2}>
              <IconButton
                variant="ghost"
                size="sm"
                icon="search"
                label="Search"
              />
              <FlexItem grow={1}>
                <div
                  style={{
                    height: '1.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--surface-neutral)',
                  }}
                />
              </FlexItem>
              <Button variant="filled" size="sm">
                Go
              </Button>
            </Group>
          </div>
        </StoryItem>
        <StoryItem label="alignSelf overrides parent">
          <div
            style={{
              height: 64,
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
            }}
          >
            <Group align="stretch" gap={2} style={{ height: '100%' }}>
              <Box label="stretch" />
              <FlexItem alignSelf="start">
                <Box label="start" />
              </FlexItem>
              <FlexItem alignSelf="center">
                <Box label="center" />
              </FlexItem>
              <FlexItem alignSelf="end">
                <Box label="end" />
              </FlexItem>
            </Group>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
