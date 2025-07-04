import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';

import { getOneBoard } from '../redux/board/boardOperations';
import { selectOneBoard, selectIsLoading } from '../redux/board/boardSelectors';
import { getColumnsByBoard } from '../redux/columns/columnsOperations';
import { getAllCards } from '../redux/cards/cardsOperations';

import { MainContainer } from 'components/App/App.styled';
import Dashboard from 'components/Dashboard';
import BoardHeader from 'components/Dashboard/BoardHeader';
import Loader from 'components/Loader';

import backgrounds from 'images/background/backgrounds';

// ✅ Transformă un string (ex. 'bg-4' sau URL) în obiect cu URL-uri pentru MainContainer
const getBackgroundObject = background => {
  if (!background) return null;

  // Dacă e un URL complet (custom upload)
  if (background.startsWith('http')) {
    return {
      backgroundMobileURL: background,
      backgroundMobile2xURL: background,
      backgroundTabletURL: background,
      backgroundTablet2xURL: background,
      backgroundDesktopURL: background,
      backgroundDesktop2xURL: background,
    };
  }

  // Dacă e de forma 'bg-4'
  if (background.startsWith('bg-')) {
    const id = Number(background.replace('bg-', ''));
    const bg = backgrounds.find(bg => bg.id === id);
    if (!bg) return null;

    return {
      backgroundMobileURL: bg.mobile,
      backgroundMobile2xURL: bg.mobile,
      backgroundTabletURL: bg.tablet,
      backgroundTablet2xURL: bg.tablet,
      backgroundDesktopURL: bg.desktop,
      backgroundDesktop2xURL: bg.desktop,
    };
  }

  return null;
};

const ScreensPage = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const board = useSelector(selectOneBoard);
  const isLoading = useSelector(selectIsLoading);

  // ✅ Încarcă board-ul, coloanele și cardurile din backend - secvențial pentru a evita erorile
  useEffect(() => {
    if (boardId) {
      // Încărcăm secvențial pentru a ne asigura că avem date corecte
      dispatch(getOneBoard(boardId))
        .then(() => dispatch(getColumnsByBoard(boardId)))
        .then(() => dispatch(getAllCards()))
        .catch(err => console.error('❌ Eroare la încărcarea datelor:', err));
    }
  }, [dispatch, boardId]);

  // ✅ Debugging
  useEffect(() => {
    if (board) {
      console.log('🧩 board.background:', board.background);
    }
  }, [board]);

  // ✅ Redirecționează dacă boardul nu există
  if (!isLoading && !board) {
    return <Navigate to="/home" replace />;
  }

  if (isLoading || !board) {
    return <Loader />;
  }

  const bgObject = getBackgroundObject(board.background);

  return (
    <MainContainer $bg={bgObject}>
      <BoardHeader title={board.title} boardId={boardId} />
      <Dashboard board={board} />
    </MainContainer>
  );
};

export default ScreensPage;
