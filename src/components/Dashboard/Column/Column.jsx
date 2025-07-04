import { useState, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cardsSelectors } from '../../../redux/cards/cardsSelectors';
import { deleteColumn } from '../../../redux/columns/columnsOperations';
import Pencil from 'components/Icons/Pencil';
import Trash from 'components/Icons/Trash';
import ColumnModal from 'components/Modals/ColumnModal';
import CardModal from 'components/Modals/CardModal';
import Plus from 'components/Icons/Plus';
import DeleteModal from 'components/Modals/DeleteModal/DeleteModal';
import TaskCard from '../TaskCard';
import { EmptyMsg } from '../Dashboard.styled';
import {
  AddButton,
  ButtonsList,
  CardsList,
  ColumnButton,
  ColumnTitleWrap,
  ColumnWrap,
  IconWrap,
} from './Column.styled';

const Column = ({ allColumns, column, isDragging = false }) => {
  // All hooks must be called at the top level
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Calculate derived values that depend on column or allColumns,
  // using null/undefined safe operations
  const columnId = column?._id || `column-${Date.now()}`;

  // Get cards for this column using the selector
  const columnCards = useSelector(state => cardsSelectors.selectCardsByColumnId(state, columnId));

  const validCards = useMemo(() => {
    return columnCards.filter(card => card && card._id);
  }, [columnCards]);

  const cardsId = useMemo(() => {
    return validCards.map(card => card._id);
  }, [validCards]);

  // Make column sortable
  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: columnId,
    data: {
      column,
    },
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
    zIndex: isSortableDragging ? 999 : 'auto',
    position: 'relative',
  };

  // useDroppable for cards
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: columnId,
    data: {
      column: column || {},
    },
  });

  // Combine refs for the column
  const setNodeRef = (node) => {
    setSortableNodeRef(node);
    setDroppableRef(node);
  };

  // Event handlers with useMemo
  const handleColumnDelete = useMemo(() => {
    return () => {
      if (column?._id) {
        dispatch(deleteColumn(column._id));
      }
      setIsDeleteModalShown(false);
    };
  }, [dispatch, column?._id]);

  const handleOpenEditModal = useMemo(() => {
    return () => setIsEditColumnModalOpen(true);
  }, []);

  const handleOpenDeleteModal = useMemo(() => {
    return () => setIsDeleteModalShown(true);
  }, []);

  const handleOpenAddCardModal = useMemo(() => {
    return () => setIsAddCardModalOpen(true);
  }, []);

  // Guard clause if column is undefined or null - after all hooks
  if (!column || !column._id) {
    return null;
  }

  return (
    <>
      <ColumnWrap
        ref={setNodeRef}
        style={sortableStyle}
        $isDragging={isSortableDragging || isDragging}
      >
        <ColumnTitleWrap
          {...attributes}
          {...listeners}
        >
          <h3>{column.title}</h3>
          <ButtonsList>
            <li>
              <ColumnButton
                type="button"
                aria-label="Edit column title"
                onClick={handleOpenEditModal}
              >
                <Pencil
                  width={16}
                  height={16}
                  strokeColor={'var(--plus-icon-bg)'}
                />
              </ColumnButton>
            </li>
            <li>
              <ColumnButton
                id="column-delete"
                type="button"
                aria-label="Delete column"
                onClick={handleOpenDeleteModal}
              >
                <Trash
                  width={16}
                  height={16}
                  strokeColor={'var(--plus-icon-bg)'}
                />
              </ColumnButton>
            </li>
          </ButtonsList>
        </ColumnTitleWrap>
        {validCards.length === 0 ? (
          <EmptyMsg>{t('cards.empty')}</EmptyMsg>
        ) : (
          <SortableContext
            id={column._id}
            items={cardsId}
            strategy={verticalListSortingStrategy}
          >
            <CardsList ref={setNodeRef} $isOver={isOver}>
              {validCards.map(card => (
                <li key={card._id}>
                  <TaskCard
                    allColumns={allColumns || []}
                    columnId={column._id}
                    card={card}
                  />
                </li>
              ))}
            </CardsList>
          </SortableContext>
        )}
        <AddButton type="button" onClick={handleOpenAddCardModal}>
          <IconWrap>
            <Plus width={14} height={14} />
          </IconWrap>
          {t('cards.addButton')}
        </AddButton>
      </ColumnWrap>

      {isEditColumnModalOpen && (
        <ColumnModal
          variant="edit"
          closeModal={() => setIsEditColumnModalOpen(false)}
          columnId={column._id}
          columnName={column.title}
        />
      )}

      {isAddCardModalOpen && (
        <CardModal
          columnId={column._id}
          variant="add"
          closeCardModal={() => setIsAddCardModalOpen(false)}
        />
      )}

      {isDeleteModalShown && (
        <DeleteModal
          onClose={() => setIsDeleteModalShown(false)}
          onConfirm={handleColumnDelete}
        />
      )}
    </>
  );
};

export default memo(Column);
