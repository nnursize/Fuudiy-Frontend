import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Avatar } from "@mui/material";
import LogoutPopup from "../components/LogoutPopup";

const API_BASE_URL = "http://localhost:8000";

// Helper function to generate the correct avatar image path
const getAvatarSrc = (avatarId) => {
  return avatarId && avatarId.includes(".png")
    ? `/avatars/${avatarId}`
    : `/avatars/${avatarId}.png`;
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem("accessToken");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch user data (including avatar) if logged in
  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_BASE_URL}/users/${userData}`)
        .then((response) => {
          const user = response.data.data[0];
          setUserData(user);
          console.log("User from backend: ", user);
        })
        .catch((error) =>
          console.error("Error fetching user data:", error)
        );
    }
  }, [isLoggedIn]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).catch((err) =>
      console.error("Language switch failed:", err)
    );
  };

  // This function is called when the logout is confirmed in the popup
  const handleLogoutConfirmed = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setShowDropdown(false);
    setShowLogoutPopup(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    if (userData) {
      navigate(`/profile/${userData}`);
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
          {isLoggedIn ? (
            <ProfileContainer>
              <Avatar
                src={
                  userData && userData.avatarId
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
                    Profile
                  </DropdownItem>
                  <DropdownItem onClick={() => setShowLogoutPopup(true)}>
                    Log-out
                  </DropdownItem>
                </DropdownMenu>
              )}
            </ProfileContainer>
          ) : (
            <LoginContainer>
              <Link to="/login">{t("login")}</Link>
              <ProfileIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-3.3137 0-6 1.6863-6 3.7619V19h12v-1.2381c0-2.0756-2.6863-3.7619-6-3.7619z"
                  />
                </svg>
              </ProfileIcon>
            </LoginContainer>
          )}
        </RightSection>
      </HeaderContainer>
      {/* Render the LogoutPopup for confirmation */}
      <LogoutPopup
        open={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onLogout={handleLogoutConfirmed}
      />
    </>
  );
};

export default Header;

// Styled-components

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

// Fallback for non-logged in state
const ProfileIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 100%;
    height: 100%;
    color: gray;
  }
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
