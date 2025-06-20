import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Create as CreateIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Add as AddIcon,
  FormatListNumbered as ListIcon
} from '@mui/icons-material';
import { fetchBoards, selectAllBoards } from '../../features/boards/boardsSlice';
import { useAuth } from '../../hooks';
import Logo from '../../assets/logo.svg';

/**
 * Sidebar component with navigation links
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the sidebar is open on mobile
 * @param {Function} props.onClose - Function to close the sidebar
 * @param {number} props.width - Width of the sidebar
 * @param {string} props.variant - Drawer variant ('permanent' or 'temporary')
 * @returns {JSX.Element} Sidebar component
 */
const Sidebar = ({ isOpen, onClose, width, variant = 'permanent' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const boards = useSelector(selectAllBoards);

  // Fetch boards when component mounts
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  // Handle board click
  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`);
    if (variant === 'temporary') {
      onClose();
    }
  };

  // Handle create board button click
  const handleCreateBoard = () => {
    navigate('/dashboard');
    if (variant === 'temporary') {
      onClose();
    }
  };

  // First letter of user name for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Check if the current path is active
  const isPathActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Check if a board is active
  const isBoardActive = (boardId) => {
    return location.pathname === `/boards/${boardId}`;
  };

  return (
    <Drawer
      variant={variant}
      open={isOpen}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? '#f5f6f8' : theme.palette.background.paper,
          boxShadow: theme =>
            theme.palette.mode === 'light' ? '1px 0px 10px rgba(0,0,0,0.05)' : 'none'
        }
      }}
    >
      {/* Logo and app name */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: theme => `1px solid ${theme.palette.divider}`
      }}>
        <img src={Logo} alt="Task Pro Logo" style={{ height: 28, marginRight: 12 }} />
        <Typography variant="h6" component={Link} to="/"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            letterSpacing: 1,
            fontWeight: 600
          }}>
          TASK PRO
        </Typography>
      </Box>

      {/* User profile section */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {user?.avatar ? (
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{ width: 40, height: 40 }}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            {getInitials(user?.name)}
          </Avatar>
        )}

        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 500 }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Main navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={isPathActive('/dashboard')}
              onClick={() => {
                navigate('/dashboard');
                if (variant === 'temporary') {
                  onClose();
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemIcon>
                <DashboardIcon color={isPathActive('/dashboard') ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              MY BOARDS
            </Typography>
            <Tooltip title="Create new board">
              <Button
                color="primary"
                aria-label="create new board"
                onClick={handleCreateBoard}
                size="small"
              >
                <AddIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Box>

          {/* Boards list */}
          {boards.length > 0 ? (
            boards.map((board) => (
              <ListItem disablePadding key={board._id}>
                <ListItemButton
                  selected={isBoardActive(board._id)}
                  onClick={() => handleBoardClick(board._id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5
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
                      style: { fontWeight: isBoardActive(board._id) ? 500 : 400 }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" color="textSecondary">
                No boards yet
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CreateIcon />}
                onClick={handleCreateBoard}
                sx={{ mt: 1 }}
                size="small"
                fullWidth
              >
                Create Board
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* Additional navigation */}
          <ListItem disablePadding>
            <ListItemButton
              selected={isPathActive('/settings')}
              onClick={() => {
                navigate('/settings');
                if (variant === 'temporary') {
                  onClose();
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemIcon>
                <SettingsIcon color={isPathActive('/settings') ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={isPathActive('/help')}
              onClick={() => {
                navigate('/help');
                if (variant === 'temporary') {
                  onClose();
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemIcon>
                <HelpIcon color={isPathActive('/help') ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* App info */}
      <Box sx={{
        p: 2,
        textAlign: 'center',
        borderTop: theme => `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="caption" color="textSecondary">
          Task Pro v1.0.0 • © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
