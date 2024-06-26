import React from 'react';
import { DropdownItem, DropdownList } from '@patternfly/react-core';
import { DeviceList, Fleet } from '@flightctl/types';

import { useFetchPeriodically } from '../../../hooks/useFetchPeriodically';
import { useFetch } from '../../../hooks/useFetch';
import DetailsPage from '../../DetailsPage/DetailsPage';
import DetailsPageActions, { useDeleteAction } from '../../DetailsPage/DetailsPageActions';
import FleetDetailsContent from './FleetDetailsContent';
import { useTranslation } from '../../../hooks/useTranslation';
import { ROUTE, useNavigate } from '../../../hooks/useNavigate';
import { useAppContext } from '../../../hooks/useAppContext';

const getFleetDeviceCount = (fleetDevicesResp: DeviceList | undefined): number | undefined => {
  if (fleetDevicesResp === undefined) {
    return undefined;
  }
  const hasItems = fleetDevicesResp.items.length > 0;
  const extraDevices = fleetDevicesResp.metadata.remainingItemCount || 0;
  return hasItems ? 1 + extraDevices : 0;
};

const FleetDetails = () => {
  const { t } = useTranslation();

  const {
    router: { useParams },
  } = useAppContext();
  const { fleetId } = useParams() as { fleetId: string };
  const [fleet, isLoading, error] = useFetchPeriodically<Required<Fleet>>({ endpoint: `fleets/${fleetId}` });
  const [fleetDevicesResp] = useFetchPeriodically<DeviceList>({ endpoint: `devices?owner=Fleet/${fleetId}&limit=1` });

  const { remove } = useFetch();
  const navigate = useNavigate();

  const isManaged = !!fleet?.metadata?.owner;

  const { deleteAction, deleteModal } = useDeleteAction({
    onDelete: async () => {
      await remove(`fleets/${fleetId}`);
      navigate(ROUTE.FLEETS);
    },
    resourceName: fleetId,
    resourceType: 'Fleet',
    disabledReason: isManaged && t('Fleets managed by a resource sync cannot be deleted'),
  });

  return (
    <DetailsPage
      loading={isLoading}
      error={error}
      id={fleetId}
      resourceLink="/devicemanagement/fleets"
      resourceType="Fleets"
      resourceTypeLabel={t('Fleets')}
      actions={
        <DetailsPageActions>
          <DropdownList>
            <DropdownItem
              isAriaDisabled={isManaged}
              tooltipProps={
                isManaged
                  ? {
                      content: t('Fleets managed by a resource sync cannot be edited'),
                    }
                  : undefined
              }
              onClick={() => navigate({ route: ROUTE.FLEET_EDIT, postfix: fleetId })}
            >
              {t('Edit')}
            </DropdownItem>
            {deleteAction}
          </DropdownList>
        </DetailsPageActions>
      }
    >
      {fleet && (
        <>
          <FleetDetailsContent fleet={fleet} devicesCount={getFleetDeviceCount(fleetDevicesResp)} />
          {deleteModal}
        </>
      )}
    </DetailsPage>
  );
};

export default FleetDetails;
