// Hero.js
import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
  height: 400px;
  background-image: url('/home_background.jpeg');
  background-size: cover;
  background-position: center;
  background: rgb(255,255,255,.2)
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
`;

const HeroText = styled.div`
  text-align: center;
  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.2rem;
  }
`;

// Update SearchBar styling
const SearchBar = styled.input`
  padding: 0.8rem 2rem; /* Increase padding to make it taller */
  width: 60%;           /* Adjust width for a larger search bar */
  max-width: 600px;     /* Set max width for larger screens */
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  margin-top: 1rem;
  font-size: 1rem;      /* Increase font size if needed */
  background: rgb(255, 255, 255,.2);
  `;

const Hero = () => {
  return (
    <HeroContainer>
      <HeroText>
        <h1>Discover Authentic Flavors</h1>
        <p>Explore dishes and cuisines from around the world</p>
      </HeroText>
      <SearchBar placeholder="Search dishes or cuisines..." />
    </HeroContainer>
  );
};

export default Hero;
