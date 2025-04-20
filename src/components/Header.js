import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Avatar } from "@mui/material";
import LogoutPopup from "../components/LogoutPopup";
import RefreshPopup from "../components/RefreshPopup";
import axiosInstance from "../axiosInstance";
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const SURVEY_POPUP_COOLDOWN_MINUTES = 1;

const shouldShowSurveyPopup = () => {
  const lastDeclined = localStorage.getItem("surveyPopupLastDeclined");
  if (!lastDeclined) return true;

  const cooldownTime = SURVEY_POPUP_COOLDOWN_MINUTES * 60 * 1000;
  const timeSinceDecline = Date.now() - Number(lastDeclined);

  return timeSinceDecline > cooldownTime;
};
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
        if (!response.data.data[0].survey_completed && shouldShowSurveyPopup()) {
          setTimeout(() => {
            import("sweetalert2").then(Swal => {
              Swal.default.fire({
                title: t("survey_popup.title"),
text: t("survey_popup.text"),
confirmButtonText: t("survey_popup.confirm"),
cancelButtonText: t("survey_popup.cancel"),

                didOpen: () => {
                  const popup = document.querySelector('.swal2-popup');
                  if (popup) popup.style.borderRadius = '20px';
                  const confirmButton = document.querySelector('.swal2-confirm');
                  if (confirmButton) {
                    confirmButton.style.backgroundColor = '#FFD699';
                    confirmButton.style.color = theme.palette.text.primary;
                    confirmButton.style.borderRadius = '20px';
                  }
                  const cancelButton = document.querySelector('.swal2-cancel');
                  if (cancelButton) {
                    cancelButton.style.backgroundColor = theme.palette.action.hover;
                    cancelButton.style.color = theme.palette.text.primary;
                    cancelButton.style.borderRadius = '20px';
                  }
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/survey");
                } else {
                  // Set cooldown timestamp
                  localStorage.setItem("surveyPopupLastDeclined", Date.now().toString());
                }
              });
            });
          }, 500);
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
      <HeaderWrapper>
        <HeaderContainer>
          <Logo onClick={handleLogoClick}>Fuudiy</Logo>
          <NavLinks>
            <Link to="/">{t("home")}</Link>
            {/* Only show Explore link if user is logged in */}
            {isLoggedIn && <Link to="/explore">{t("explore")}</Link>}
          </NavLinks>
          <RightSection>
            <LanguageSwitcher
              changeLanguage={changeLanguage}
              height="35px"
              width="35px"
              fontSize="0.8rem"
            />
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
                  <DropdownMenu>
                    <DropdownItem onClick={handleProfileClick}>
                      {t("profile")}
                    </DropdownItem>
                    <DropdownItem onClick={() => setShowLogoutPopup(true)}>
                      {t("logout")}
                    </DropdownItem>
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
      </HeaderWrapper>

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

// Added a wrapper to handle the fixed positioning
const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
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