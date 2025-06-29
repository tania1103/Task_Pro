import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logOut } from '../../../redux/auth/authOperations';
import {
  selectBoards,
  selectOneBoard,
} from '../../../redux/board/boardSelectors';
import { selectBoardSearch } from '../../../redux/search/searchSelectors';
import { boardSearch } from '../../../redux/search/searchSlice';
import plantImg from 'assets/images/sidebar/plant.png';
import Lightning from 'components/Icons/Lightning';
import LogOut from 'components/Icons/LogOut';
import BoardModal from 'components/Modals/BoardModal/BoardModal';
import NeedHelp from 'components/Sidebar/NeedHelp';
import Plus from 'components/Icons/Plus';
import AddedBoard from '../AddedBoard/AddedBoard';
import SearchBoardModal from 'components/Modals/SearchBoardModal';
import Search from 'components/Icons/Search';
import { BsBarChartLine } from 'react-icons/bs';
import { IoCalendarOutline } from 'react-icons/io5';
import {
  AddBtn,
  Container,
  Content,
  CreateBox,
  CreateText,
  BoardLink,
  BoardContainer,
  SearchResultWrap,
  Footer,
  HelpContainer,
  HelpSpan,
  HelpText,
  LightningBox,
  Logo,
  LogoutBtn,
  LogoutText,
  BoardsWrap,
  MyBoard,
  SearchButton,
  StatsLink,
  ExtraLink,
} from './SidebarContent.styled';

const SidebarContent = ({ menu, closeMenu }) => {
  const [isAddBoardModalShown, setIsAddBoardModalShown] = useState(false);
  const [isEditBoardModalShown, setIsEditBoardModalShown] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const searchValue = useSelector(selectBoardSearch) ?? '';
  const rawBoards = useSelector(selectBoards);
  const allBoards = useMemo(() => rawBoards ?? [], [rawBoards]);

  const currentBoard = useSelector(selectOneBoard);
  const boardsContainer = useRef(null);

  useEffect(() => {
    if (
      !Array.isArray(allBoards) ||
      !currentBoard?._id ||
      !boardsContainer.current
    )
      return;

    const currentIndex = allBoards.findIndex(
      ({ _id }) => _id === currentBoard._id
    );
    if (currentIndex === -1) return;

    const heightToScroll =
      allBoards.length > 0 ? currentIndex / allBoards.length : 0;

    boardsContainer.current.scrollTop =
      boardsContainer.current.scrollHeight * heightToScroll;
  }, [allBoards, currentBoard]);

  useEffect(() => {
    if (searchValue && allBoards.length > 0) {
      dispatch(boardSearch(''));
      setShowSearchResult(false);
    }
  }, [dispatch, allBoards, searchValue]);

  const handleSubmit = event => {
    event.preventDefault();
    const { search } = event.target.elements;

    const value = search.value.trim().toLowerCase();
    dispatch(boardSearch(value));
    setShowSearchResult(true);
    setIsSearchModalOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem('app-them');
  };

  const filteredBoards = allBoards.filter(({ title }) =>
    title?.toLowerCase().includes(searchValue)
  );

  const boardsToRender =
    searchValue && showSearchResult ? filteredBoards : allBoards;

  return (
    <Container>
      <Content>
        <Logo>
          <LightningBox>
            <Lightning
              width={12}
              height={18}
              fillColor={'var(--sidebar-lightning-fill)'}
            />
          </LightningBox>
          <p>Task Pro</p>
          <StatsLink to="stats" aria-label="To Statistics">
            <BsBarChartLine size={20} />
          </StatsLink>
          <ExtraLink to="schedule" aria-label="To Schedule">
            <IoCalendarOutline size={20} />
          </ExtraLink>
        </Logo>

        <BoardsWrap>
          <MyBoard>{`${t('sidebar.boards')}: ${allBoards.length}`}</MyBoard>
          <SearchButton
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Search width={16} height={16} />
          </SearchButton>
        </BoardsWrap>

        <CreateBox>
          <CreateText>{t('sidebar.create')}</CreateText>
          <AddBtn type="button" onClick={() => setIsAddBoardModalShown(true)}>
            <Plus
              width={20}
              height={20}
              strokeColor={'var(--sidebar-plus-icon)'}
            />
          </AddBtn>
        </CreateBox>

        <BoardContainer ref={boardsContainer}>
          {showSearchResult && (
            <SearchResultWrap>
              <p>{`${t('sidebar.search')}: ${filteredBoards.length}`}</p>
              <button
                aria-label="show all boards"
                type="button"
                onClick={() => {
                  dispatch(boardSearch(''));
                  setShowSearchResult(false);
                }}
              >
                {t('sidebar.showAll')}
              </button>
            </SearchResultWrap>
          )}

          {boardsToRender.map(board => (
            <BoardLink key={board._id} to={`/home/board/${board._id}`}>
              <AddedBoard
                allBoards={allBoards}
                board={board}
                openEditModal={() => setIsEditBoardModalShown(true)}
              />
            </BoardLink>
          ))}
        </BoardContainer>
      </Content>

      <Footer>
        <HelpContainer>
          <img src={plantImg} alt="plant" />
          <HelpText>
            {t('sidebar.helpText1')}&nbsp;
            <HelpSpan>TaskPro</HelpSpan>
            {t('sidebar.helpText2')}
          </HelpText>
          <NeedHelp />
        </HelpContainer>

        <LogoutBtn type="button" aria-label="Log out" onClick={handleLogOut}>
          <LogOut
            width={32}
            height={32}
            strokeColor={'var(--sidebar-logout)'}
          />
          <LogoutText>{t('sidebar.logoutButton')}</LogoutText>
        </LogoutBtn>
      </Footer>

      {isAddBoardModalShown && (
        <BoardModal
          variant="add"
          closeModal={() => setIsAddBoardModalShown(false)}
          menu={menu}
          closeMenu={closeMenu}
        />
      )}
      {isEditBoardModalShown && (
        <BoardModal
          variant="edit"
          closeModal={() => setIsEditBoardModalShown(false)}
        />
      )}
      {isSearchModalOpen && (
        <SearchBoardModal
          onClose={() => setIsSearchModalOpen(false)}
          handleSubmit={handleSubmit}
        />
      )}
    </Container>
  );
};

export default SidebarContent;
