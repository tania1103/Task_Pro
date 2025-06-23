import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBoard, updateBoard } from '../../redux/board/boardSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(state => state.boards.items);
  const activeBoardId = useSelector(state => state.boards.activeBoardId);

  const handleBoardClick = boardId => {
    dispatch({ type: 'boards/setActiveBoard', payload: boardId });
    navigate(`/boards/${boardId}`);
  };

  // Handlers for edit and delete actions
  const handleUpdateBoard = boardId => {
    // Exemplu rapid: update doar titlul (poți deschide un dialog pentru editare reală)
    dispatch(updateBoard({ _id: boardId, title: 'Edited title' }));
  };

  const handleDeleteBoard = boardId => {
    dispatch(deleteBoard(boardId));
  };

  const isBoardActive = boardId => activeBoardId === boardId;

  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper' }}>
      <List>
        {boards.map(board => (
          <ListItem
            disablePadding
            key={board._id}
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="edit"
                  onClick={e => {
                    e.stopPropagation();
                    handleUpdateBoard(board._id);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="delete"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteBoard(board._id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          >
            <ListItemButton
              selected={isBoardActive(board._id)}
              onClick={() => handleBoardClick(board._id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Typography variant="body1">
                  {board.icon || <ListIcon fontSize="small" />}
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary={board.title}
                primaryTypographyProps={{
                  noWrap: true,
                  style: {
                    fontWeight: isBoardActive(board._id) ? 500 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
export default Sidebar;
