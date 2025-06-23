import { useState } from 'react';
import plantImg from 'assets/images/sidebar/plant.png';
import Lightning from 'components/Icons/Lightning';
import LogOut from 'components/Icons/LogOut';
import Plus from 'components/Icons/Plus';
import Search from 'components/Icons/Search';
import { BsBarChartLine } from 'react-icons/bs';
import { IoCalendarOutline } from 'react-icons/io5';
import Puzzle from 'components/Icons/Puzzle';
import FourCircles from 'components/Icons/FourCircles';
import {
  AddBtn,
  Container,
  Content,
  CreateBox,
  CreateText,
  BoardLink,
  BoardContainer,
  Footer,
  HelpContainer,
  HelpSpan,
  HelpText,
  LightningBox,
  Logo,
  LogoutBtn,
  LogoutText,
  BoardsWrap,
  // MyBoard,
  SearchButton,
  DevsBtn,
  StatsLink,
  ExtraLink,
} from './SidebarContent.styled';

const SidebarContent = () => {
  const [, setIsAddBoardModalShown] = useState(false);

  const dummyBoards = [
    {
      _id: '1',
      title: (
        <>
          <FourCircles /> Project office
        </>
      ),
    },
    {
      _id: '2',
      title: (
        <>
          <Puzzle /> Neon Light Project
        </>
      ),
    },
  ];

  return (
    <Container>
      <Content>
        <Logo>
          <LightningBox>
            <Lightning width={12} height={18} fillColor={'#fff'} />
          </LightningBox>
          <p>Task Pro</p>
          <StatsLink to="#">
            <BsBarChartLine size={20} />
          </StatsLink>
          <ExtraLink to="#">
            <IoCalendarOutline size={20} />
          </ExtraLink>
        </Logo>

        <DevsBtn type="button">
          © Developers
        </DevsBtn>

        <BoardsWrap>
      
          <SearchButton type="button">
            <Search width={16} height={16} />
          </SearchButton>
        </BoardsWrap>

        <CreateBox>
          <CreateText>Create new board</CreateText>
          <AddBtn type="button" onClick={() => setIsAddBoardModalShown(true)}>
            <Plus width={20} height={20} strokeColor={'#fff'} />
          </AddBtn>
        </CreateBox>

        <BoardContainer>
          {dummyBoards.map(board => (
            <BoardLink key={board._id} to="#">
              {board.title}
            </BoardLink>
          ))}
        </BoardContainer>
      </Content>

      <Footer>
        <HelpContainer>
          <img src={plantImg} alt="plant" />
          <HelpText>
            Need help using&nbsp;
            <HelpSpan>TaskPro</HelpSpan>
            ? Check out the docs.
          </HelpText>
        </HelpContainer>

        <LogoutBtn type="button">
          <LogOut width={32} height={32} strokeColor={'#fff'} />
          <LogoutText>Log out</LogoutText>
        </LogoutBtn>
      </Footer>
    </Container>
  );
};
  
export default SidebarContent;


