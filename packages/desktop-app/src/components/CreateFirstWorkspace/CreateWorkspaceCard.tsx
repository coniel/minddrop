import { useTranslation } from '@minddrop/i18n';
import { ActionCard, Button, ButtonProps } from '@minddrop/ui-elements';

interface CreateWorkspaceCardProps {
  onClick: ButtonProps['onClick'];
}

export const CreateWorkspaceCard: React.FC<CreateWorkspaceCardProps> = ({
  onClick,
}) => {
  const { t } = useTranslation({ keyPrefix: 'workspaces.actions.create' });

  return (
    <ActionCard
      icon="folder-add"
      title={t('label')}
      description={t('description')}
      action={
        <Button label={t('action')} variant="contained" onClick={onClick} />
      }
    />
  );
};
