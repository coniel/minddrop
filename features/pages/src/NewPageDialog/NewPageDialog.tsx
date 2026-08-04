import { useCallback, useEffect, useMemo, useState } from 'react';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  Button,
  Dialog,
  DialogClose,
  DialogRoot,
  IconButton,
  MenuGroup,
  MenuItem,
  ScrollArea,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { PageLayoutPreview } from '../PageLayoutPreview';
import { EventListenerId, OpenNewPageDialogEvent } from '../events';
import {
  PageLayoutOption,
  filterLayoutOptions,
  getPageLayoutOptions,
} from '../utils';
import './NewPageDialog.css';

type NewPageDialogStep = 'layout' | 'properties';

export interface NewPageDialogProps {
  /**
   * Whether the dialog is open by default.
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Renders the new page creation dialog: a page layout picker with a
 * live placeholder preview, followed by a property value form.
 */
export const NewPageDialog: React.FC<NewPageDialogProps> = ({
  defaultOpen = false,
}) => {
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [step, setStep] = useState<NewPageDialogStep>('layout');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<PageLayoutOption | null>(
    null,
  );
  const designs = Designs.useAll();

  // All page layouts across designs, paired with their design
  const options = useMemo(() => getPageLayoutOptions(designs), [designs]);

  // Options matching the current search query
  const filteredOptions = useMemo(
    () => filterLayoutOptions(options, searchQuery),
    [options, searchQuery],
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);

    // Reset the dialog state after a short delay to allow the
    // close animation to complete
    setTimeout(() => {
      setStep('layout');
      setSearchQuery('');
      setSelectedOption(null);
    }, 300);
  }, []);

  const toggleDialog = useCallback(() => {
    if (dialogOpen) {
      closeDialog();
    } else {
      setDialogOpen(true);
    }
  }, [dialogOpen, closeDialog]);

  // Listen for open dialog events, and open the dialog when one is received
  useEffect(() => {
    Events.addListener(OpenNewPageDialogEvent, EventListenerId, toggleDialog);

    return () => {
      Events.removeListener(OpenNewPageDialogEvent, EventListenerId);
    };
  }, [toggleDialog]);

  function handleNext() {
    setStep('properties');
  }

  function handleBack() {
    setStep('layout');
  }

  return (
    <DialogRoot open={dialogOpen} onOpenChange={toggleDialog}>
      <Dialog className="new-page-dialog">
        {step === 'layout' && (
          <div className="layout-step">
            <div className="left-column">
              <TextInput
                clearable
                variant="subtle"
                size="md"
                placeholder="pages.form.layout.search.placeholder"
                value={searchQuery}
                onValueChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
              <ScrollArea className="layout-list">
                {/* No page layouts exist at all */}
                {!options.length && (
                  <Text
                    paragraph
                    size="sm"
                    color="muted"
                    text="pages.form.layout.empty"
                  />
                )}
                {/* The search query matched no layouts */}
                {options.length > 0 && !filteredOptions.length && (
                  <Text
                    paragraph
                    size="sm"
                    color="muted"
                    text="pages.form.layout.noMatches"
                  />
                )}
                <MenuGroup>
                  {filteredOptions.map((option) => (
                    <MenuItem
                      key={option.layout.id}
                      stringLabel={option.layout.name}
                      active={option.layout.id === selectedOption?.layout.id}
                      onClick={() => setSelectedOption(option)}
                    />
                  ))}
                </MenuGroup>
              </ScrollArea>
            </div>
            <div className="right-column">
              <div className="header">
                <DialogClose
                  render={
                    <IconButton label="actions.cancel" icon="x" color="muted" />
                  }
                />
              </div>
              {selectedOption ? (
                <PageLayoutPreview
                  design={selectedOption.design}
                  layout={selectedOption.layout}
                />
              ) : (
                <div className="preview-empty">
                  <Text
                    size="sm"
                    color="muted"
                    text="pages.form.layout.preview.empty"
                  />
                </div>
              )}
              <div className="footer">
                <Button
                  label="actions.cancel"
                  variant="ghost"
                  onClick={closeDialog}
                />
                <Button
                  label="pages.form.actions.next"
                  variant="solid"
                  color="primary"
                  disabled={!selectedOption}
                  onClick={handleNext}
                />
              </div>
            </div>
          </div>
        )}
        {step === 'properties' && (
          <div className="properties-step">
            <div className="header">
              <DialogClose
                render={
                  <IconButton label="actions.cancel" icon="x" color="muted" />
                }
              />
            </div>
            {/* Property form (implemented in the next phase) */}
            <div className="content" />
            <div className="footer">
              <Button
                label="pages.form.actions.back"
                variant="ghost"
                onClick={handleBack}
              />
              <Button
                disabled
                label="pages.form.actions.create"
                variant="solid"
                color="primary"
              />
            </div>
          </div>
        )}
      </Dialog>
    </DialogRoot>
  );
};
