import * as React from 'react';
import { Label, LabelProps } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { QuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import { InProgressIcon } from '@patternfly/react-icons/dist/js/icons/in-progress-icon';

import { ConditionType } from '@flightctl/types';
import { RepositorySyncStatus, repositoryStatusLabels } from '../../utils/status/repository';
import WithTooltip from '../common/WithTooltip';
import { useTranslation } from '../../hooks/useTranslation';

const StatusInfo = ({ statusInfo }: { statusInfo: { status: RepositorySyncStatus; message?: string } }) => {
  const statusType = statusInfo.status;
  const { t } = useTranslation();

  const statusLabels = repositoryStatusLabels(t);

  let icon: LabelProps['icon'];
  let color: LabelProps['color'];
  switch (statusType) {
    case ConditionType.ResourceSyncSynced:
    case ConditionType.RepositoryAccessible:
      color = 'green';
      icon = <CheckCircleIcon />;
      break;
    case 'Sync pending':
      color = 'orange';
      icon = <InProgressIcon />;
      break;
    case 'Not synced':
    case 'Not parsed':
    case 'Not accessible':
      color = 'red';
      icon = <ExclamationCircleIcon />;
      break;

    default:
      color = 'grey';
      icon = <QuestionCircleIcon />;
      break;
  }

  return (
    <WithTooltip showTooltip={!!statusInfo.message} content={statusInfo.message}>
      <Label color={color} icon={icon}>
        {statusLabels[statusType]}
      </Label>
    </WithTooltip>
  );
};

export default StatusInfo;
