import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Avatar } from "@mui/material";
import LogoutPopup from "../components/LogoutPopup";
import RefreshPopup from "../components/RefreshPopup";
import axiosInstance from "../axiosInstance";
import Tooltip from "@mui/material/Tooltip";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Badge from '@mui/material/Badge';

const getAvatarSrc = (avatarId) => {
  return avatarId && avatarId.includes(".png")
    ? `/avatars/${avatarId}`
    : `/avatars/${avatarId}.png`;
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showRefreshPopup, setShowRefreshPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const heartRef = useRef(null);

  // Check token expiration
  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      setTokenExpiryTime(expiryTime);
      return expiryTime < Date.now();
    } catch (error) {
      return true;
    }
  }, []);

  // Refresh token function
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.post("/auth/refresh", { token });
      localStorage.setItem("accessToken", response.data.access_token);
      checkTokenExpiration();
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        heartRef.current &&
        !heartRef.current.contains(e.target)
      ) {
        setShowRequestsPanel(false);
      }
  
      if (
        !e.target.closest(".profile-dropdown") &&
        !e.target.closest(".MuiAvatar-root")
      ) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  // Check login status and fetch user data
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        cleanupAuth();
        return;
      }

      if (checkTokenExpiration()) {
        // Token is expired, show refresh popup if not already shown
        if (!showRefreshPopup) {
          setShowRefreshPopup(true);
        }
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/users/me");
        setIsLoggedIn(true);
        setUserData(response.data.data[0]);
        try {
          const username = response.data.data[0].username;
          const res = await axiosInstance.get(`/connections/requests/details/${username}`);
          console.log("RES: ", res);
          const pending = res.data?.incoming_requests || [];
          setPendingRequests(pending);
          setPendingRequestCount(pending.length);
        } catch (err) {
          console.warn("Failed to fetch incoming requests:", err);
        }        
        
      } catch (error) {
        if (error.response?.status === 401) {
          cleanupAuth();
          navigate("/login");
        }
      }
    };

    checkAuthStatus();

    // Set up periodic check (every minute)
    const interval = setInterval(checkAuthStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration, navigate, showRefreshPopup]);

  // Set up timeout for token expiration warning
  useEffect(() => {
    if (!tokenExpiryTime) return;

    const timeUntilExpiry = tokenExpiryTime - Date.now();
    const warningTime = 5 * 60 * 1000; // 5 minutes before expiry

    if (timeUntilExpiry > warningTime) {
      const timeout = setTimeout(() => {
        setShowRefreshPopup(true);
      }, timeUntilExpiry - warningTime);

      return () => clearTimeout(timeout);
    } else if (timeUntilExpiry > 0) {
      // If we're already within warning period
      setShowRefreshPopup(true);
    }
  }, [tokenExpiryTime]);

  const cleanupAuth = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    setShowLogoutPopup(false);
    setShowRefreshPopup(false);
  };

  const handleStayLoggedIn = async () => {
    const success = await refreshToken();
    if (!success) {
      cleanupAuth();
      navigate("/login");
    }
    setShowRefreshPopup(false);
  };

  const handleForceLogout = () => {
    cleanupAuth();
    navigate("/login");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).catch((err) =>
      console.error("Language switch failed:", err)
    );
  };

  const handleRequestResponse = async (connectionId, status) => {
    try {
      console.log("connection id: ", connectionId);
  
      if (status === "rejected") {
        await axiosInstance.delete(`/connections/remove-by-id/${connectionId}`);
      } else {
        await axiosInstance.put(`/connections/update-status`, {
          connection_id: connectionId,
          status
        });
      }
  
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== connectionId)
      );
      setPendingRequestCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(`Failed to ${status} connection:`, err);
    }
  };  

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      cleanupAuth();
    }
  };

  const handleProfileClick = () => {
    if (userData) {
      navigate(`/profile/${userData.username}`);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <>
      <HeaderContainer>
        <Logo onClick={handleLogoClick}>Fuudiy</Logo>
        <NavLinks>
          <Link to="/">{t("home")}</Link>
          <Link to="/explore">{t("explore")}</Link>
        </NavLinks>
        <RightSection>
          <LanguageSwitcher
            changeLanguage={changeLanguage}
            height="35px"
            width="35px"
            fontSize="0.8rem"
          />
          <div ref={heartRef} style={{ position: "relative" }}>
            <Badge badgeContent={pendingRequestCount} color="error">
              <FavoriteIcon 
                sx={{ cursor: "pointer", fontSize: 28, color: "#aaa" }} 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRequestsPanel((prev) => !prev);
                  setShowDropdown(false);
                }}
              />
            </Badge>
          </div>

          {isLoggedIn ? (
            <ProfileContainer>
              <Avatar
                src={
                  userData?.avatarId
                    ? getAvatarSrc(userData.avatarId)
                    : "/avatars/default_avatar.png"
                }
                alt="User Avatar"
                sx={{ width: 24, height: 24, cursor: "pointer" }}
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <DropdownMenu className="profile-dropdown">
                  <DropdownItem onClick={handleProfileClick}>{t("profile")}</DropdownItem>
                  <DropdownItem onClick={() => setShowLogoutPopup(true)}>{t("logout")}</DropdownItem>
                </DropdownMenu>
              )}
            </ProfileContainer>
          ) : (
            <LoginContainer>
              <Link to="/login">{t("login")}</Link>
            </LoginContainer>
          )}
        </RightSection>
      </HeaderContainer>

      {showRequestsPanel && (
        <RequestsPanel>
          <strong>{t("connectionRequests")}</strong>
          {pendingRequests.length === 0 ? (
            <p style={{ fontSize: "0.9rem", marginTop: 8 }}>{t("noRequests")}</p>
          ) : (
            pendingRequests.map((req, index) => (
              <RequestItem key={index}>
                <div>
                  <span
                    style={{
                      color: "#000", // black text
                      cursor: "pointer",
                      fontWeight: 500,
                      textDecoration: "underline", // optional for indicating it's clickable
                    }}
                    onClick={() => navigate(`/profile/${req.from_username}`)}
                  >
                    {req.from_username || t("Unknown")}
                  </span>
                  <br />
                  <RequestMeta>{new Date(req.created_at).toLocaleString()}</RequestMeta>
                </div>
                <RequestButtons>
                  <button onClick={() => handleRequestResponse(req._id, "accepted")}>✓</button>
                  <button onClick={() => handleRequestResponse(req._id, "rejected")}>✕</button>
                </RequestButtons>
              </RequestItem>

            ))
          )}
        </RequestsPanel>
      )}
      
      <LogoutPopup
        open={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onLogout={handleLogout}
      />
      
      <RefreshPopup
        open={showRefreshPopup}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleForceLogout}
      />
    </>
  );
};


export default Header;
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
`;

const NavLinks = styled.nav`
  display: flex;
  justify-content: center;
  flex: 1;
  gap: 30px;
  a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
    transition: color 0.3s;
    &:hover {
      color: rgb(0, 0, 0);
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  a {
    text-decoration: none;
    color: rgb(10, 10, 10);
    font-size: 1rem;
    font-weight: bold;
    transition: color 0.3s;
    &:hover {
      color: rgb(0, 0, 0);
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 120px;
  z-index: 100;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const RequestsPanel = styled.div`
  position: absolute;
  top: 50px; /* just below the heart icon */
  right: 35px; /* shift slightly to the left */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 240px;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    right: 35px; /* adjust to align with heart */
    border-width: 0 8px 8px 8px;
    border-style: solid;
    border-color: transparent transparent #ddd transparent;
  }

  &::after {
    content: "";
    position: absolute;
    top: -7px;
    right: 35px;
    border-width: 0 7px 7px 7px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
  }
`;


const RequestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  font-size: 0.9rem;
`;

const RequestButtons = styled.div`
  display: flex;
  gap: 8px;

  button {
    border: none;
    background-color: transparent;
    font-size: 1.1rem;
    cursor: pointer;
    transition: color 0.2s;

    &:first-child {
      color: green;
    }

    &:last-child {
      color: red;
    }

    &:hover {
      font-weight: bold;
    }
  }
`;

const RequestMeta = styled.div`
  font-size: 0.75rem;
  color: #777;
  margin-top: 2px;
`;
