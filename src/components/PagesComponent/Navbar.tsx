import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router";
import Logo from "../../assets/logo.svg";
import CreatePost from "../CreatePost";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => signOut();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigation Links
  const navLinks = {
    home: { name: "Home", fun: () => navigate("/") },
    jobs: { name: "Jobs", fun: () => navigate("/jobs") },
    events: { name: "Events", fun: () => navigate("/events") },
    contact: { name: "Contact", fun: () => navigate("/contact") },
    about: { name: "About", fun: () => navigate("/about") },
  };

  // Avatar Dropdown Links
  const avatarLinks = {
    profile: { name: "Profile", fun: () => navigate("/profile") },
    
    logout: { name: "Logout", fun: handleLogout },
  };

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          mb: 2,
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Left Side - Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingX: 0,
                paddingY: 1,
              }}
            >
              <Link to="/">
                <img src={Logo} alt="Logo" width="55%" />
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {Object.values(navLinks).map(({ name, fun }) => (
                <Button key={name} onClick={fun} color="inherit">
                  {name}
                </Button>
              ))}
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 10 }}
                onClick={() => setOpen(true)}
              >
                POST
              </Button>

              {/* Avatar with Menu (Desktop) */}
              <IconButton onClick={handleAvatarClick}>
                <Avatar
                  alt="User Avatar"
                  src={
                    user?.profile_pic
                      ? user.profile_pic
                      : "/static/images/avatar/1.jpg"
                  }
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>

              {/* Avatar Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {Object.values(avatarLinks).map(({ name, fun }) => (
                  <MenuItem
                    key={name}
                    onClick={() => {
                      fun();
                      handleClose();
                    }}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Avatar (Replaces Menu Icon) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" }, paddingBottom: 0 }}
            >
              <Avatar
                alt="User Avatar"
                src={
                  user?.profile_pic
                    ? user.profile_pic
                    : "/static/images/avatar/1.jpg"
                }
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {/* Avatar in Drawer - Top Right */}
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Avatar
            alt="User Avatar"
            src={
              user?.profile_pic
                ? user.profile_pic
                : "/static/images/avatar/1.jpg"
            }
            sx={{ width: 50, height: 50 }}
          />
        </Box>
        <Divider />

        <List sx={{ width: 250 }}>
          {/* Navigation Links */}
          {Object.entries(navLinks).map(([key, { name, fun }], index) => (
            <React.Fragment key={key}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    fun();
                    handleDrawerToggle();
                  }}
                >
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
              {index < Object.keys(navLinks).length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <Divider />

          {/* Avatar Menu Options */}
          {Object.entries(avatarLinks).map(([key, { name, fun }]) => (
            <ListItem disablePadding key={key}>
              <ListItemButton
                onClick={() => {
                  fun();
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider />

          {/* Create Post Button */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpen(true)}>
              <ListItemText primary="Create Post" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* CreatePost Component (Must Be Rendered Separately) */}
      <CreatePost open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Navbar;
