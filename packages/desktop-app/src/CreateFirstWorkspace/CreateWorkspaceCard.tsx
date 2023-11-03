import { useTranslation } from '@minddrop/i18n';
import { ActionCard, Button, ButtonProps } from '@minddrop/ui';

interface CreateWorkspaceCardProps {
  onClick: ButtonProps['onClick'];
}

export const CreateWorkspaceCard: React.FC<CreateWorkspaceCardProps> = ({
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <ActionCard
      icon="folder-add"
      title={t('createWorkspace')}
      description={t('createWorkspaceDescription')}
      action={<Button label="create" variant="contained" onClick={onClick} />}
    />
  );
};
