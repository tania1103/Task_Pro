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
    <Aside>
      <SidebarContent />
    </Aside>
  );
};
export default Sidebar;