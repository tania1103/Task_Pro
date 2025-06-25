import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { MdFileUpload, MdDownloadDone } from 'react-icons/md';
import { createBoard, updateBoard } from '../../../redux/board/boardOperations';
import { selectOneBoard } from '../../../redux/board/boardSelectors';
import { DEFAULT_BACKGROUND_ID, TOASTER_CONFIG } from 'constants';
import { validateInputMaxLength } from 'helpers';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { IconsList } from './IconsList';
import { BacksList } from './BacksList';
import Plus from 'components/Icons/Plus';
import {
  Form,
  Title,
  Label,
  Input,
  Text,
  Button,
  Span,
  BackCustomInputRadio,
  StyledFileLabel,
  StyledFileInput,
} from './BoardModal.styled';
import { useNavigate } from 'react-router-dom';

const BoardModal = ({ variant, closeModal, menu, closeMenu }) => {
  const [errorMsgShown, setErrorMsgShown] = useState(false);
  const [errorClassName, setErrorClassName] = useState('');
  const [customBackground, setCustomBackground] = useState(null);
  const defaultBackgroundId = nanoid();

  const titleRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const oneBoard = useSelector(selectOneBoard);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const handleUpload = event => {
    const file = event.target.files[0];
    setCustomBackground(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { title, background, iconId } = e.target.elements;

    if (!title.value.trim()) {
      return toast(t('boards.modals.toast.error'), TOASTER_CONFIG);
    }

    const data = {
      title: title.value,
      iconId: iconId.value,
      background: customBackground ?? background.value,
    };

    if (variant === 'add') {
      dispatch(createBoard(data)).then(action => {
        if (action.type === 'boards/createBoard/fulfilled')
          navigate(`board/${action.payload._id}`);
      });
      toast(t('boards.modals.toast.add.success'), TOASTER_CONFIG);
    } else {
      dispatch(updateBoard({ boardId: oneBoard._id, dataUpdate: data }));
      toast(t('boards.modals.toast.edit.success'), TOASTER_CONFIG);
    }

    closeModal();
    if (menu) closeMenu();
    return;
  };

  return (
    <ModalWrapper width={350} onClose={closeModal}>
      <Form onSubmit={handleSubmit}>
        <Title>
          {variant === 'add'
            ? t('boards.modals.newTitle')
            : t('boards.modals.editTitle')}
        </Title>
        <Label>
          <Input
            className={errorClassName}
            ref={titleRef}
            type="text"
            placeholder={t('boards.modals.input')}
            name="title"
            defaultValue={variant === 'add' ? '' : oneBoard.title}
            autoComplete="off"
            maxLength={25}
            onChange={e =>
              validateInputMaxLength(e, setErrorMsgShown, setErrorClassName)
            }
          />
          {errorMsgShown && <p>{t('toast.maxTitle')}</p>}
        </Label>
        <Text>{t('boards.modals.icons')}</Text>
        <IconsList iconId={variant === 'add' ? 0 : oneBoard.icon_id} />
        <Text>{t('boards.modals.background')}</Text>
        <BacksList
          backgroundId={
            variant === 'add' ? DEFAULT_BACKGROUND_ID : oneBoard.background._id
          }
          customBackground={customBackground}
        />

        <Text>{t('boards.modals.customBackground')}</Text>
        <Label>
          <BackCustomInputRadio
            type="radio"
            name="background"
            defaultChecked={defaultBackgroundId}
          />
        </Label>

        <StyledFileLabel>
          {customBackground
            ? t('boards.modals.fileChosen')
            : t('boards.modals.chooseFile')}
          <StyledFileInput
            type="file"
            name="background"
            onChange={handleUpload}
          />
          {customBackground ? <MdDownloadDone /> : <MdFileUpload />}
        </StyledFileLabel>

        <Button type="submit">
          <Span>
            <Plus
              width={14}
              height={14}
              strokeColor={'var(--btn-icon-color)'}
            />
          </Span>
          {variant === 'add'
            ? t('boards.modals.newButton')
            : t('boards.modals.editButton')}
        </Button>
      </Form>
    </ModalWrapper>
  );
};

export default BoardModal;
