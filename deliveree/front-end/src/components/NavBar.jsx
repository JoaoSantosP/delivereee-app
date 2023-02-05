import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Utils */
import navLinksMap from '../utils/navLinksMap';
import LocalStorageMethods from '../utils/localStorage';

export default function NavBar() {
  const { pathname } = useLocation();

  const shouldRender = pathname.includes('customer')
    || pathname.includes('seller');

  // Navigation Links
  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user && shouldRender) {
      const username = JSON.parse(user).name;
      const path = pathname.split('/')[1];

      setNavLinks(navLinksMap(username)[path]);
    }
  }, [pathname, shouldRender]);

  // Logout
  const clearLocalStorage = () => {
    LocalStorageMethods.deleteItem('user');
    LocalStorageMethods.deleteItem('products');
  };

  return shouldRender && (
    <nav>
      <ul>
        {
          navLinks.map(({ dataTestId, name, to }) => (
            <li key={ name }>
              <button
                type="button"
                onClick={
                  name === 'Logout' ? clearLocalStorage : () => {}
                }
              >
                <Link data-testid={ dataTestId } to={ to }>{name}</Link>
              </button>
            </li>
          ))
        }
      </ul>
    </nav>
  );
}
