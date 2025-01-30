import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation("global");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).catch((err) => console.error("Language switch failed:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <HeaderContainer>
      <Logo>Fuudiy</Logo>
      <NavLinks>
        <Link to="/">{t("home")}</Link>
        <Link to="/explore">{t("explore")}</Link>
      </NavLinks>
      <RightSection>
        <LanguageSwitcher changeLanguage={changeLanguage} />
        {isLoggedIn ? (
          <>
            <UserProfile>
              <img src="https://via.placeholder.com/40" alt="User Avatar" />
            </UserProfile>
            <button onClick={handleLogout} className="logout-button">
              {t("logout")}
            </button>
          </>
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
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;

  a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
    transition: color 0.3s;

    &:hover {
      color:rgb(0, 0, 0);
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    text-decoration: none;
    color:rgb(10, 10, 10);
    font-size: 1rem;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color:rgb(0, 0, 0);
    }
  }

  .logout-button {
    background-color: black;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #333;
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

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

const UserProfile = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;
