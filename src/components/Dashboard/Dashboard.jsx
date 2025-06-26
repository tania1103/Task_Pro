import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import {
  fetchBoards,
  createBoard,
  selectAllBoards,
  selectBoardsLoading,
} from '../../features/boards/boardsSlice';
import { MainLayout } from '../layouts';

/**
 * Dashboard Page Component
 * Displays all boards and allows creating new ones
 * @returns {JSX.Element} Dashboard page
 */
const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(selectAllBoards);
  const isLoading = useSelector(selectBoardsLoading);

  // New board modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardIcon, setNewBoardIcon] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    // Fetch boards when component mounts
    dispatch(fetchBoards());
  }, [dispatch]);

  /**
   * Navigate to a specific board
   * @param {string} boardId - ID of the board to navigate to
   */
  const handleBoardClick = boardId => {
    navigate(`/boards/${boardId}`);
  };

  /**
   * Open the create board modal
   */
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewBoardTitle('');
    setNewBoardIcon('');
    setTitleError('');
  };

  /**
   * Close the create board modal
   */
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  /**
   * Create a new board
   */
  const handleCreateBoard = async () => {
    // Validate board title
    if (!newBoardTitle.trim()) {
      setTitleError('Board title is required');
      return;
    }

    if (newBoardTitle.trim().length < 2) {
      setTitleError('Board title must be at least 2 characters');
      return;
    }

    if (newBoardTitle.trim().length > 50) {
      setTitleError('Board title must be less than 50 characters');
      return;
    }

    // Create the board
    const resultAction = await dispatch(
      createBoard({
        title: newBoardTitle.trim(),
        icon: newBoardIcon.trim() || undefined,
      })
    );

    // Handle successful creation
    if (createBoard.fulfilled.match(resultAction)) {
      const newBoardId = resultAction.payload._id;
      setIsCreateModalOpen(false);
      navigate(`/boards/${newBoardId}`);
    }
  };

  return (
    <MainLayout title="Dashboard">
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <DashboardIcon sx={{ mr: 1 }} /> My Boards
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Board
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : boards.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 10,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              You don't have any boards yet
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Create your first board to start managing tasks
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
            >
              Create Your First Board
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {boards.map(board => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardActionArea
                    sx={{ height: '100%' }}
                    onClick={() => handleBoardClick(board._id)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        {board.icon && (
                          <Typography variant="h5" sx={{ mr: 1 }}>
                            {board.icon}
                          </Typography>
                        )}
                        <Typography variant="h6" noWrap>
                          {board.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {board.columns?.length || 0} columns
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Created:{' '}
                        {new Date(board.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Board Dialog */}
        <Dialog
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Create New Board</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Board Title"
              type="text"
              fullWidth
              value={newBoardTitle}
              onChange={e => {
                setNewBoardTitle(e.target.value);
                if (e.target.value.trim()) {
                  setTitleError('');
                }
              }}
              error={!!titleError}
              helperText={titleError}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Board Icon (emoji)"
              type="text"
              fullWidth
              value={newBoardIcon}
              onChange={e => setNewBoardIcon(e.target.value)}
              helperText="Optional: Add an emoji to represent your board"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateModal}>Cancel</Button>
            <Button
              onClick={handleCreateBoard}
              color="primary"
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};
export default DashboardPage;
