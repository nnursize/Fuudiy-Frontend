import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status

  // Simulate checking login status (e.g., via localStorage, API call, or context)
  useEffect(() => {
    const user = localStorage.getItem("user"); // Assume user data is stored in localStorage
    if (user) {
      setIsLoggedIn(true); // If user exists, set login status to true
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    setIsLoggedIn(false); // Update login status
  };

  return (
    <HeaderContainer>
      <Logo>Fuudiy</Logo>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
      </NavLinks>
      <RightSection>
        {isLoggedIn ? (
          <>
            <UserProfile />
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
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
    color:rgb(0, 0, 0);
    font-size: 1rem;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color:rgb(0, 0, 0);
    }
  }

  .logout-button {
    background-color:rgb(0, 0, 0);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }

  .logout-button:hover {
    background-color:rgb(0, 0, 0);
  }
`;

const UserProfile = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
`;
