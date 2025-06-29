import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from 'components/Sidebar';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import Header from 'components/Header';

const SharedLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <Header openMenu={openMenu} />
      <Sidebar />
      <SidebarMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default SharedLayout;
