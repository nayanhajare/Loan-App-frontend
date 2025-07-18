import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Switch, Button, useTheme, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { useThemeMode } from '../context/ThemeContext';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/NotificationProvider';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', roles: ['user', 'admin'] },
  { to: '/apply', label: 'Apply', roles: ['user'] },
  { to: '/loans', label: 'My Loans', roles: ['user'] },
  { to: '/calendar', label: 'Repayment', roles: ['user'] },
  { to: '/compare', label: 'Compare', roles: ['user'] },
  { to: '/admin', label: 'Admin', roles: ['admin'] },
];

const Layout = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { notifications } = useNotification();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleBellClick = (event) => setAnchorEl(event.currentTarget);
  const handleBellClose = () => setAnchorEl(null);
  const unreadCount = notifications.length;

  // Determine links to show based on user role
  let linksToShow = [];
  if (user) {
    linksToShow = navLinks.filter(link => link.roles.includes(user.role));
  }

  // Choose link color based on theme mode
  const linkColor = mode === 'dark' ? '#fff' : theme.palette.text.primary;
  const linkActiveColor = mode === 'dark' ? '#fff' : theme.palette.primary.main;

  // Responsive nav links
  const renderNavLinks = () => (
    <>
      {linksToShow.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            color: location.pathname === link.to ? linkActiveColor : linkColor,
            textDecoration: 'none',
            fontWeight: location.pathname === link.to ? 700 : 400,
            borderBottom: location.pathname === link.to ? `2px solid ${linkActiveColor}` : 'none',
            padding: '6px 0',
            transition: 'color 0.2s',
          }}
          onClick={() => setDrawerOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const renderAuthLinks = () => (
    <>
      <Link
        to="/login"
        style={{
          color: location.pathname === '/login' ? linkActiveColor : linkColor,
          textDecoration: 'none',
          fontWeight: location.pathname === '/login' ? 700 : 400,
          borderBottom: location.pathname === '/login' ? `2px solid ${linkActiveColor}` : 'none',
          padding: '6px 0',
          transition: 'color 0.2s',
        }}
        onClick={() => setDrawerOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/register"
        style={{
          color: location.pathname === '/register' ? linkActiveColor : linkColor,
          textDecoration: 'none',
          fontWeight: location.pathname === '/register' ? 700 : 400,
          borderBottom: location.pathname === '/register' ? `2px solid ${linkActiveColor}` : 'none',
          padding: '6px 0',
          transition: 'color 0.2s',
        }}
        onClick={() => setDrawerOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/dashboard')}
          >
            Loan App
          </Typography>
          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {user ? renderNavLinks() : renderAuthLinks()}
            {user && <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>Logout</Button>}
            <IconButton color="inherit" onClick={handleBellClick} sx={{ ml: 1 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleBellClose} PaperProps={{ sx: { minWidth: 320 } }}>
              <Box px={2} py={1} fontWeight={700}>Notifications</Box>
              {notifications.length === 0 ? (
                <MenuItem disabled>No notifications</MenuItem>
              ) : notifications.slice(0, 10).map(n => (
                <MenuItem key={n.id} sx={{ whiteSpace: 'normal', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color={n.severity === 'error' ? 'error.main' : n.severity === 'success' ? 'success.main' : 'text.primary'} fontWeight={600}>{n.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(n.timestamp).toLocaleString()}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
            <Switch checked={mode === 'dark'} onChange={toggleTheme} sx={{ ml: 2 }} />
          </Box>
          {/* Mobile nav */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {user ? (
              linksToShow.map(link => (
                <ListItem key={link.to} disablePadding>
                  <ListItemButton component={Link} to={link.to} selected={location.pathname === link.to}>
                    <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: location.pathname === link.to ? 700 : 400, color: location.pathname === link.to ? linkActiveColor : linkColor }} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/login" selected={location.pathname === '/login'}>
                    <ListItemText primary="Login" primaryTypographyProps={{ fontWeight: location.pathname === '/login' ? 700 : 400, color: location.pathname === '/login' ? linkActiveColor : linkColor }} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/register" selected={location.pathname === '/register'}>
                    <ListItemText primary="Register" primaryTypographyProps={{ fontWeight: location.pathname === '/register' ? 700 : 400, color: location.pathname === '/register' ? linkActiveColor : linkColor }} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {user && <Button color="primary" variant="outlined" onClick={logout}>Logout</Button>}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">Dark Mode</Typography>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} />
            </Box>
          </Box>
        </Box>
      </Drawer>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper', mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Loan App. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout; 