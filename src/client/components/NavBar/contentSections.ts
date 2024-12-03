import type { NavigationItem } from './NavBar';
import { routes } from 'wasp/client/router';
//import { BlogUrl, DocsUrl } from '../../../shared/common';

export const appNavigationItems: NavigationItem[] = [
  { name: 'AI Scheduler (Demo App)', to: routes.RootRoute.to },
  { name: 'File Upload (AWS S3)', to: routes.RootRoute.to },
  { name: 'Pricing', to: routes.RootRoute.to },
];
