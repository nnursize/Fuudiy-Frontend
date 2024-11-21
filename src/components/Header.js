// Header.js
import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  background: rgb(255,255,255,.2)

  `;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  a {
    color: #333;
    text-decoration: none;
    &:hover {
      color: #000;
    }
  }
`;

// Placeholder for the profile icon or component
const UserProfile = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>Fuudiy</Logo>
      <NavLinks>
        <a href="#">Home</a>
        <a href="#">Explore</a>
        <a href="#">Top Dishes</a>
      </NavLinks>
      <UserProfile /> {/* Replace SearchBar with UserProfile */}
    </HeaderContainer>
  );
};

export default Header;
