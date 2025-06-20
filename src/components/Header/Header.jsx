import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks';
import { logout } from '../../features/auth/authSlice';
import { useThemeToggle } from '../../hooks';

/**
 * Header component with app bar, title, and user menu
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {Function} props.onToggleSidebar - Function to toggle sidebar
 * @param {number} props.sidebarWidth - Width of the sidebar
 * @returns {JSX.Element} Header component
 */
const Header = ({ title, onToggleSidebar, sidebarWidth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeToggle();

  // User menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Open user menu
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close user menu
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  // Handle profile click
  const handleProfileClick = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  // Handle settings click
  const handleSettingsClick = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };

  // Handle help click
  const handleHelpClick = () => {
    handleCloseUserMenu();
    navigate('/help');
  };

  // Handle logout
  const handleLogout = async () => {
    handleCloseUserMenu();
    await dispatch(logout());
    navigate('/login');
  };

  // First letter of user name for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` }
      }}
      color="primary"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {title}
        </Typography>

        {/* Theme toggle button */}
        <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Help */}
        <Tooltip title="Help">
          <IconButton
            color="inherit"
            sx={{ mr: 2 }}
            onClick={handleHelpClick}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>

        {/* User menu */}
        <Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleOpenUserMenu}
              size="small"
              sx={{ padding: 0 }}
              aria-controls={isMenuOpen ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isMenuOpen ? 'true' : undefined}
            >
              {user?.avatar ? (
                <Avatar
                  alt={user.name}
                  src={user.avatar}
                  sx={{ width: 40, height: 40 }}
                />
              ) : (
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                  {getInitials(user?.name)}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleCloseUserMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
