// src/components/CategoryCard.js
import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 300px;
  margin: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardTitle = styled.h3`
  margin: 0.5rem;
  font-size: 1.2rem;
  color: #333;
`;

const CategoryCard = ({ image, title }) => {
  return (
    <CardContainer>
      <CardImage src={image} alt={title} />
      <CardTitle>{title}</CardTitle>
    </CardContainer>
  );
};

export default CategoryCard;
