import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensors,
  useSensor,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { changeCardOrder, moveCard } from '../../redux/cards/cardsOperations';
import { reorderColumns, getColumnsByBoard } from '../../redux/columns/columnsOperations';
import { columnsSelectors } from '../../redux/columns/columnsSelectors';
import Plus from 'components/Icons/Plus';
import ColumnModal from 'components/Modals/ColumnModal';
import Column from './Column';
import TaskCard from './TaskCard/TaskCard';
import { AddButton, ColumnsList, IconWrap, Wrap } from './Dashboard.styled';

const Dashboard = ({ board }) => {
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [druggedCard, setDruggedCard] = useState(null);
  const [druggedColumn, setDruggedColumn] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const columns = useSelector(columnsSelectors.selectSortedColumns);

  useEffect(() => {
    if (board && board._id) {
      dispatch(getColumnsByBoard(board._id));
    }
  }, [board, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const onDragStart = event => {
    const { data } = event.active;

    // Check if we're dragging a card or a column
    if (data.current?.card) {
      setDruggedCard(data.current.card);
      setActiveColumnId(data.current?.sortable?.containerId);
    } else if (data.current?.column) {
      setDruggedColumn(data.current.column);
    }
  };

  const onDragEnd = event => {
    setDruggedCard(null);
    setDruggedColumn(null);

    const { active, over } = event;

    // Validate that we have the required objects
    if (!over || !active || !active.data || !active.data.current) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle column reordering
    if (active.data.current?.column && over.data.current?.column) {
      // Find the index of the active and over columns
      const activeColumnIndex = columns.findIndex(col => col._id === activeId);
      const overColumnIndex = columns.findIndex(col => col._id === overId);

      if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
        // Create a new array with the moved columns
        const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);

        // Dispatch reorder action to backend
        if (board && board._id) {
          dispatch(reorderColumns({
            boardId: board._id,
            columns: newColumns
          }));
        }
      }
      return;
    }

    // Handle card reordering or moving between columns
    const isOverTheSame =
      over.data.current?.sortable &&
      active.data.current?.sortable?.containerId &&
      over.data.current?.sortable?.containerId &&
      active.data.current?.sortable.containerId ===
        over.data.current?.sortable.containerId;

    if (!isOverTheSame) {
      const newColumn =
        over.data.current?.sortable?.containerId ??
        (over.data.current?.column && over.data.current?.column._id);

      const oldColumn = active.data.current?.sortable?.containerId;

      // Only dispatch if we have valid column IDs
      if (newColumn && oldColumn) {
        dispatch(
          moveCard({
            cardId: activeId,
            newColumn,
            oldColumn,
          })
        );
      }
    } else {
      // Verify that sortable index exists
      if (over.data.current?.sortable?.index !== undefined && activeColumnId) {
        const newIndex = over.data.current.sortable.index;
        dispatch(
          changeCardOrder({
            cardId: activeId,
            columnId: activeColumnId,
            order: newIndex,
          })
        );
      }
    }
  };

  return (
    <Wrap>
      {columns.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          autoScroll={{}}
        >
          <ColumnsList>
            {columns.map(column => (
              <li key={column._id}>
                <Column
                  allColumns={columns}
                  column={column}
                />
              </li>
            ))}
          </ColumnsList>
          {createPortal(
            <DragOverlay>
              {druggedCard && (
                <TaskCard
                  allColumns={columns}
                  columnId={activeColumnId}
                  card={druggedCard}
                />
              )}
              {druggedColumn && (
                <Column
                  column={druggedColumn}
                  allColumns={columns}
                  isDragging={true}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      )}

      <AddButton type="button" onClick={() => setIsAddColumnModalOpen(true)}>
        <IconWrap>
          <Plus width={14} height={14} />
        </IconWrap>
        {t('columns.addButton')}
      </AddButton>

      {isAddColumnModalOpen && (
        <ColumnModal
          variant="add"
          closeModal={() => setIsAddColumnModalOpen(false)}
        />
      )}
    </Wrap>
  );
};

export default Dashboard;
