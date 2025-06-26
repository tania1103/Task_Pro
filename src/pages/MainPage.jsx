import { useState } from 'react';
import { MainContainer } from 'components/App/App.styled';
import Sidebar from 'components/Sidebar/Sidebar';
import SidebarMenu from 'components/Sidebar/SidebarMenu/SidebarMenu';
import SharedLayout from 'layouts/SharedLayout';
import BoardCard from 'components/Modals/CardModal/CardModal';

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
    // document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    // document.body.style.overflow = '';
  };

  return (
    <>
      <SharedLayout openMenu={openMenu} />
      {window.innerWidth >= 1440 ? (
        <Sidebar />
      ) : (
        <SidebarMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
      )}
      <main>
        <MainContainer><BoardCard /></MainContainer>
      </main>
    </>
  );
};

export default MainPage;