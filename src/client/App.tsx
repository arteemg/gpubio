import './Main.css';
import NavBar from './components/NavBar/NavBar';
import CookieConsentBanner from './components/cookie-consent/Banner';
import { useMemo, useEffect } from 'react';
import { routes } from 'wasp/client/router';
import { Outlet, useLocation } from 'react-router-dom';
//import { useAuth } from 'wasp/client/auth';
import { useIsLandingPage } from './hooks/useIsLandingPage';
import { myNavigationItems } from './contentSections';

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export default function App() {
  const location = useLocation();
  //const { data: user } = useAuth();
  const isLandingPage = useIsLandingPage();


  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className='min-h-screen dark:text-white dark:bg-boxdark-2'>
        {isAdminDashboard ? (
          <Outlet />
        ) : (
          <>
            <NavBar navigationItems={myNavigationItems} />
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
              <Outlet />
            </div>
          </>
        )}
      </div>
      <CookieConsentBanner />
    </>
  );
}









