// Hero.js
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const HeroContainer = styled.section`
  height: 500px; /* Full height of the viewport */
  width: 100%; /* Full width */
  background: url('/h-background-2.png');
  background-size: cover; /* Ensure the image covers the entire container */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
`;

const HeroText = styled.div`
  text-align: center;
  color: white;
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
  max-width: 800px;     /* Set max width for larger screens */
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  font-size: 1rem;      /* Increase font size if needed */
  background: rgb(255, 255, 255,.2);
  `;

const Hero = () => {
  const { t, i18n } = useTranslation("global");

  return (    
    <HeroContainer>
      <HeroText>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </HeroText>
      <SearchBar placeholder={t('searchPlaceholder')} />
    </HeroContainer>
  );
};

export default Hero;
