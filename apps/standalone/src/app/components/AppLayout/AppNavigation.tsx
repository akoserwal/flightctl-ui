import * as React from 'react';
import { Nav, NavList } from '@patternfly/react-core';

import { getAppRoutes } from '../../routes';

import NavItem from '@flightctl/ui-components/components/NavItem/NavItem';
import { useTranslation } from '@flightctl/ui-components/hooks/useTranslation';

const AppNavigation = () => {
  const { t } = useTranslation();
  return (
    <Nav id="flightclt-nav" theme="dark">
      <NavList id="flightclt-navlist">
        {getAppRoutes(t)
          .filter((route) => route.showInNav)
          .map((route) => (
            <NavItem key={route.path} to={route.path || ''}>
              {route.title}
            </NavItem>
          ))}
      </NavList>
    </Nav>
  );
};

export default AppNavigation;
