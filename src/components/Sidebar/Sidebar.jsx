import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../redux/board/boardSelectors';
import SidebarContent from './SidebarContent';
import { Aside } from './Sidebar.styled';

const Sidebar = () => {
  const allBoards = useSelector(selectBoards);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(allBoards) || allBoards.length === 0) {
      navigate('/home');
    }
  }, [allBoards, navigate]);

  return (
    <Aside>
      <SidebarContent />
    </Aside>
  );
};

export default Sidebar;
