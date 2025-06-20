/**
 * Column component for displaying a column with cards
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Droppable } from 'react-beautiful-dnd';
import Card from '../../cards/Card';

const Column = ({ column }) => {
  const dispatch = useDispatch();
  const cards = useSelector(state => state.cards.items.filter(card => card.columnId === column.id));

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditColumn = () => {
    handleMenuClose();
    // Open edit column modal
    console.log('Edit column clicked');
  };

  const handleDeleteColumn = () => {
    handleMenuClose();
    // Open confirm delete modal
    console.log('Delete column clicked');
  };

  const handleAddCard = () => {
    // Open add card modal
    console.log('Add card clicked');
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: 350,
        minWidth: 350,
        maxWidth: 350,
        height: '100%',
        borderRadius: 2,
        bgcolor: 'custom.columnBackground',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {column.title}
        </Typography>

        <IconButton
          size="small"
          onClick={handleMenuClick}
          aria-label="column menu"
          aria-controls={open ? 'column-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="column-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditColumn}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit Column
          </MenuItem>
          <MenuItem onClick={handleDeleteColumn}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete Column
          </MenuItem>
        </Menu>
      </Box>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1,
              bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'inherit',
              transition: 'background-color 0.2s ease',
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      <Box sx={{
        p: 1,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box
          onClick={handleAddCard}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.selected',
            }
          }}
        >
          <AddIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">Add Card</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Column;
