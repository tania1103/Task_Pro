import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdFileUpload, MdDownloadDone } from 'react-icons/md';
import { axiosInstance } from 'api';

import { createBoard, getOneBoard } from '../../../redux/board/boardOperations';
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

import backgrounds from 'images/background/backgrounds';
import { boardSearch } from '../../../redux/search/searchSlice';
import { updateBoard } from '../../../redux/board/boardOperations';

const getBackgroundUrlById = id => {
  const bg = backgrounds.find(bg => bg.id === Number(id));
  return bg?.desktop || '';
};

const BoardModal = ({ variant, closeModal, menu, closeMenu }) => {
  const oneBoard = useSelector(selectOneBoard);
  const [errorMsgShown, setErrorMsgShown] = useState(false);
  const [errorClassName, setErrorClassName] = useState('');
  const [customBackground, setCustomBackground] = useState(null);
  const [titleValue, setTitleValue] = useState(
    variant === 'add' ? '' : oneBoard?.title || ''
  );
  const [selectedBackId, setSelectedBackId] = useState(
    variant === 'add'
      ? DEFAULT_BACKGROUND_ID
      : oneBoard?.background?.id || DEFAULT_BACKGROUND_ID
  );
  const [selectedIcon, setSelectedIcon] = useState(
    variant === 'add' ? '📋' : oneBoard?.icon || '📋'
  );

  const titleRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleUpload = event => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCustomBackground(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const titleRaw = titleValue.trim();

    if (!titleRaw || titleRaw.length < 3 || titleRaw.length > 50) {
      toast(t('toast.minTitle'), TOASTER_CONFIG);
      return;
    }

    try {
      if (variant === 'add') {
        const initialBackground = `bg-${selectedBackId}`;

        const payload = {
          title: titleRaw,
          icon: selectedIcon,
          background: initialBackground,
        };

        const action = await dispatch(createBoard(payload));

        if (
          action.type === 'boards/createBoard/fulfilled' &&
          action.payload &&
          (action.payload.data?._id || action.payload._id)
        ) {
          const board = action.payload.data || action.payload;
          const boardId = board._id;

          if (customBackground instanceof File) {
            try {
              const imageForm = new FormData();
              imageForm.append('image', customBackground);

              const response = await axiosInstance.patch(
                `/api/boards/${boardId}/background`,
                imageForm
              );

              if (response?.data?.data?.background) {
                await dispatch(getOneBoard(boardId));
              }
            } catch (uploadErr) {
              console.error('⚠️ Upload imagine eșuat:', uploadErr);
              toast(t('boards.modals.toast.uploadError'), TOASTER_CONFIG);
            }
          }

          dispatch(boardSearch(''));
          toast(t('boards.modals.toast.add.success'), TOASTER_CONFIG);
          navigate(`/home/board/${boardId}`);
        } else {
          console.error('❌ Board creation failed or missing ID:', action);
          toast(t('boards.modals.toast.add.error'), TOASTER_CONFIG);
          return;
        }
      }

      // ✅ VARIANTA: EDIT
      if (variant === 'edit') {
        const boardId = oneBoard._id;

        const updatedData = {
          title: titleRaw,
          icon: selectedIcon,
          background: `bg-${selectedBackId}`,
        };

        await dispatch(updateBoard({ boardId, dataUpdate: updatedData }));

        if (customBackground instanceof File) {
          try {
            const formData = new FormData();
            formData.append('image', customBackground);

            await axiosInstance.patch(
              `/api/boards/${boardId}/background`,
              formData
            );

            await dispatch(getOneBoard(boardId));
          } catch (err) {
            console.error('❌ Eroare la upload background edit:', err);
            toast(t('boards.modals.toast.uploadError'), TOASTER_CONFIG);
          }
        }

        toast(t('boards.modals.toast.edit.success'), TOASTER_CONFIG);
      }
    } catch (err) {
      console.error('🔥 Unexpected error:', err);
      toast(t('toast.generalError'), TOASTER_CONFIG);
      return;
    }

    closeModal();
    if (menu) closeMenu();
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
            name="title"
            type="text"
            value={titleValue}
            placeholder={t('boards.modals.input')}
            autoComplete="off"
            minLength={3}
            maxLength={50}
            onChange={e => {
              setTitleValue(e.target.value);
              validateInputMaxLength(e, setErrorMsgShown, setErrorClassName);
            }}
            required
          />
          {errorMsgShown && <p>{t('toast.maxTitle')}</p>}
        </Label>

        <Text>{t('boards.modals.icons')}</Text>
        <IconsList
          iconId={variant === 'add' ? 0 : oneBoard.icon_id}
          onIconChange={setSelectedIcon}
        />

        <Text>{t('boards.modals.background')}</Text>
        <BacksList
          backgroundId={selectedBackId}
          customBackground={customBackground}
          onSelectBackground={setSelectedBackId}
        />

        <Text>{t('boards.modals.preview')}</Text>
        <div
          style={{
            width: '100%',
            height: '100px',
            marginBottom: '1rem',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: customBackground
              ? `url(${URL.createObjectURL(customBackground)})`
              : `url(${getBackgroundUrlById(selectedBackId)})`,
          }}
        />

        <Text>{t('boards.modals.customBackground')}</Text>
        <Label>
          <BackCustomInputRadio
            type="radio"
            name="background"
            value="custom"
            defaultChecked={!!customBackground}
          />
        </Label>

        <StyledFileLabel>
          {customBackground
            ? customBackground.name
            : t('boards.modals.chooseFile')}
          <StyledFileInput
            type="file"
            accept="image/*"
            name="backgroundUpload"
            onChange={handleUpload}
          />
          {customBackground ? <MdDownloadDone /> : <MdFileUpload />}
        </StyledFileLabel>

        <Button type="submit" disabled={titleValue.trim().length < 3}>
          <Span>
            <Plus width={14} height={14} strokeColor="var(--btn-icon-color)" />
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
