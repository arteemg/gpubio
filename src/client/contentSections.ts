import type { NavigationItem } from '../client/components/NavBar/NavBar';
import { routes } from 'wasp/client/router';

export const myNavigationItems: NavigationItem[] = [
    { name: 'Home', to: routes.RootRoute.to },
    { name: 'Human Proteome', to: routes.HumanProteomeRoute.to },
    { name: 'About Us', to: routes.AboutUsRoute.to }
];