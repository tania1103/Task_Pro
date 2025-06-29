import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteBoard } from '../../../redux/board/boardOperations';
import { ICONS_ARRAY } from 'constants';
import sprite from 'assets/images/icons/icons-sprite.svg';
import Pencil from 'components/Icons/Pencil';
import Trash from 'components/Icons/Trash';

import {
  BoardBoxInfo,
  ChangeBox,
  ChangeIcons,
  NameBox,
} from './AddedBoard.styled';
import DeleteModal from 'components/Modals/DeleteModal/DeleteModal';
import { getAllBoards } from '../../../redux/board/boardOperations';

const AddedBoard = ({ board, openEditModal }) => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!board) return null;

  const boardIcon =
    ICONS_ARRAY.find(icon => icon.value === board.icon) ?? ICONS_ARRAY[0];

  const handleBoardDelete = () => {
    dispatch(deleteBoard(board._id)).then(action => {
      if (action.type === 'boards/deleteBoard/fulfilled') {
        // 🔄 Reîncarcă lista de boarduri
        dispatch(getAllBoards());
        navigate('/home');
      }
    });

    setIsDeleteModalShown(false);
  };

  return (
    <>
      <BoardBoxInfo>
        <NameBox>
          <svg stroke={'var(--sidebar-icon-color)'} width={16} height={16}>
            <use href={`${sprite}#${boardIcon.name}`} />
          </svg>
          <p>{board.title}</p>
        </NameBox>

        <ChangeBox id="change-container">
          <ChangeIcons
            type="button"
            aria-label="Edit board"
            onClick={openEditModal}
          >
            <Pencil
              width={16}
              height={16}
              strokeColor={'var(--sidebar-change-color)'}
            />
          </ChangeIcons>
          <ChangeIcons
            type="button"
            aria-label="Delete board"
            onClick={() => setIsDeleteModalShown(true)}
          >
            <Trash
              width={16}
              height={16}
              strokeColor={'var(--sidebar-change-color)'}
            />
          </ChangeIcons>
        </ChangeBox>
      </BoardBoxInfo>

      {isDeleteModalShown && (
        <DeleteModal
          onClose={() => setIsDeleteModalShown(false)}
          onConfirm={handleBoardDelete}
        />
      )}
    </>
  );
};

export default AddedBoard;
