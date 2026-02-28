/**
 * Tabs.stories.tsx
 * Dev reference for the Tabs component.
 */

import { useState } from 'react';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';
import { Tabs, TabsList, TabsTab, TabsPanel } from './Tabs';

export const TabsStories = () => {
  const [controlled, setControlled] = useState('documents');

  return (
    <Story title="Tabs">

      {/* --------------------------------------------------------
          BASIC
          Simple uncontrolled tabs with text labels.
      -------------------------------------------------------- */}
      <StorySection title="Basic" description="Uncontrolled tabs with defaultValue.">
        <StoryRow>
          <StoryItem label="default">
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTab value="one">Tab one</TabsTab>
                <TabsTab value="two">Tab two</TabsTab>
                <TabsTab value="three">Tab three</TabsTab>
              </TabsList>
              <TabsPanel value="one">Content for tab one</TabsPanel>
              <TabsPanel value="two">Content for tab two</TabsPanel>
              <TabsPanel value="three">Content for tab three</TabsPanel>
            </Tabs>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          WITH ICONS
          Tabs with startIcon rendered before the label.
      -------------------------------------------------------- */}
      <StorySection title="With icons" description="Tabs with a startIcon before the label text.">
        <StoryRow>
          <StoryItem label="startIcon">
            <Tabs defaultValue="documents">
              <TabsList>
                <TabsTab value="documents" startIcon="file-text">Documents</TabsTab>
                <TabsTab value="images" startIcon="image">Images</TabsTab>
                <TabsTab value="settings" startIcon="settings">Settings</TabsTab>
              </TabsList>
            </Tabs>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          SIZES
          sm, md (default), lg — matches Button sizing.
      -------------------------------------------------------- */}
      <StorySection title="Sizes" description="Size is set on each TabsTab. Matches Button size scale.">
        <StoryRow>
          <StoryItem label="sm">
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTab value="one" size="sm" startIcon="file-text">Tab one</TabsTab>
                <TabsTab value="two" size="sm" startIcon="image">Tab two</TabsTab>
                <TabsTab value="three" size="sm" startIcon="settings">Tab three</TabsTab>
              </TabsList>
            </Tabs>
          </StoryItem>
          <StoryItem label="md (default)">
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTab value="one" size="md" startIcon="file-text">Tab one</TabsTab>
                <TabsTab value="two" size="md" startIcon="image">Tab two</TabsTab>
                <TabsTab value="three" size="md" startIcon="settings">Tab three</TabsTab>
              </TabsList>
            </Tabs>
          </StoryItem>
          <StoryItem label="lg">
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTab value="one" size="lg" startIcon="file-text">Tab one</TabsTab>
                <TabsTab value="two" size="lg" startIcon="image">Tab two</TabsTab>
                <TabsTab value="three" size="lg" startIcon="settings">Tab three</TabsTab>
              </TabsList>
            </Tabs>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          CONTROLLED
          Value and onValueChange managed externally.
      -------------------------------------------------------- */}
      <StorySection title="Controlled" description="Value managed via useState. Active: {controlled}.">
        <StoryRow>
          <StoryItem label="controlled">
            <Tabs value={controlled} onValueChange={setControlled}>
              <TabsList>
                <TabsTab value="documents" startIcon="file-text">Documents</TabsTab>
                <TabsTab value="images" startIcon="image">Images</TabsTab>
                <TabsTab value="settings" startIcon="settings">Settings</TabsTab>
              </TabsList>
            </Tabs>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED
          Individual tabs can be disabled.
      -------------------------------------------------------- */}
      <StorySection title="Disabled" description="Individual tabs can be disabled to prevent interaction.">
        <StoryRow>
          <StoryItem label="middle tab disabled">
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTab value="one" startIcon="file-text">Tab one</TabsTab>
                <TabsTab value="two" startIcon="image" disabled>Tab two</TabsTab>
                <TabsTab value="three" startIcon="settings">Tab three</TabsTab>
              </TabsList>
            </Tabs>
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
