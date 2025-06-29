import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectBoards,
  selectBoardsIsLoading,
} from '../redux/board/boardSelectors';
import { selectIsLoading as selectThemeIsLoading } from '../redux/theme/themeSelector';

import { MainContainer } from 'components/App/App.styled';
import BeforeStart from 'components/Dashboard/BeforeStart';
import Loader from 'components/Loader';

const HomePage = () => {
  const allBoards = useSelector(selectBoards);
  const isBoardsLoading = useSelector(selectBoardsIsLoading);
  const isThemeLoading = useSelector(selectThemeIsLoading);

  const isLoading = isBoardsLoading || isThemeLoading;

  if (isLoading) return <Loader strokeColor="#fff" />;

  if (allBoards.length > 0) {
    // Navigăm automat către primul board dacă există
    return <Navigate to={`/home/board/${allBoards[0]._id}`} />;
  }

  return (
    <MainContainer>
      <BeforeStart />
    </MainContainer>
  );
};

export default HomePage;
