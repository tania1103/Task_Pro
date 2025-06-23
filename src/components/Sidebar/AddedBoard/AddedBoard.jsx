import { ICONS_ARRAY } from 'constants';
import sprite from 'assets/images/icons/icons-sprite.svg';
import { ReactComponent as PlusIcon } from 'assets/images/icons/plus.svg';
import { ReactComponent as LightningIcon } from 'assets/images/icons/lightning.svg';
import { ReactComponent as LogoutIcon } from 'assets/images/icons/log-out.svg';

import {
  Container,
  Content,
  Footer,
  Logo,
  ExtraLink,
  StatsLink,
  LightningBox,
  BoardsWrap,
  MyBoard,
  AddBtn,
  CreateText,
  CreateBox,
  DevsBtn,
  BoardContainer,
  BoardLink,
  HelpContainer,
  HelpText,
  HelpSpan,
  HelpBtn,
  LogoutBtn,
  LogoutText,
  BottomContainer,
} from './SidebarContent.styled';

const mockBoards = [
  { _id: '1', title: 'Project Alpha', icon_id: 0 },
  { _id: '2', title: 'Marketing Team', icon_id: 3 },
  { _id: '3', title: 'Design UI', icon_id: 5 },
];

const SidebarContent = () => {
  return (
    <Container>
      <Content>
        <Logo>
          <LightningBox>
            <LightningIcon width={16} height={16} />
          </LightningBox>
          Task Manager
        </Logo>

        <BoardsWrap>
          <MyBoard>My Boards</MyBoard>
          <StatsLink to="/statistics">Statistics</StatsLink>
        </BoardsWrap>

        <BoardContainer>
          {mockBoards.map(board => (
            <BoardLink key={board._id} to={`/board/${board._id}`}>
              <svg width={16} height={16} stroke="currentColor">
                <use href={`${sprite}#${ICONS_ARRAY[board.icon_id].name}`} />
              </svg>
              <span style={{ marginLeft: 10 }}>{board.title}</span>
            </BoardLink>
          ))}
        </BoardContainer>

        <CreateBox>
          <CreateText>Create new board</CreateText>
          <AddBtn>
            <PlusIcon width={16} height={16} stroke="currentColor" />
          </AddBtn>
        </CreateBox>

        <HelpContainer>
          <HelpText>
            Need help? <HelpSpan>Check our guides</HelpSpan>
          </HelpText>
          <HelpBtn>
            <LightningIcon width={14} height={14} />
            Learn More
          </HelpBtn>
        </HelpContainer>
      </Content>

      <Footer>
        <BottomContainer>
          <LogoutBtn>
            <LogoutIcon width={16} height={16} />
            <LogoutText>Log Out</LogoutText>
          </LogoutBtn>
        </BottomContainer>

        <DevsBtn>Developed by You</DevsBtn>
      </Footer>
    </Container>
  );
};

export default SidebarContent;
