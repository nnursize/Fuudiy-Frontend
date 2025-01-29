import React from 'react';
import styled from 'styled-components';
import FoodItemCard from '../components/FoodItemCard';
import dummyUserData from '../data/dummyUserData.json';
import DefaultHeader from "../components/Header";
import Footer from "../components/Footer";


const ProfileContainer = styled.div`
  padding: 2rem;
  background-color: #fff; /* No background image */
  color: #333; /* Ensure readable text color */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.5rem;
`;

const ProfileDetails = styled.div`
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    margin: 0.5rem 0;
    color: #555;
  }
`;

const Section = styled.div`
  margin-top: 2rem;

  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const FoodCardContainer = styled.div`
  border: 2px solid #ddd; /* Add border */
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const UserProfile = () => {
    const userData = dummyUserData;

    return (
      <>
      <DefaultHeader />
        <ProfileContainer>
            <Header>
                <ProfileImage
                    src={userData.profilePicture || `${process.env.PUBLIC_URL}/default-profile.jpeg`}
                    alt={userData.username || 'User Profile'}
                />
                <ProfileDetails>
                    <h1>{userData.username || 'Anonymous User'}</h1>
                    <p>{userData.bio || 'No bio available.'}</p>
                </ProfileDetails>
            </Header>

            <Section>
                <h2>Favorite Dishes</h2>
                <div className="cards-container">
                    {userData.favoriteDishes.map((dish, index) => (
                        <FoodCardContainer key={index}>
                            <FoodItemCard food={dish} />
                        </FoodCardContainer>
                    ))}
                </div>
            </Section>

            <Section>
                <h2>Recently Viewed Dishes</h2>
                <div className="cards-container">
                    {userData.recentlyViewed.map((dish, index) => (
                        <FoodCardContainer key={index}>
                            <FoodItemCard food={dish} />
                        </FoodCardContainer>
                    ))}
                </div>
            </Section>
        </ProfileContainer>
        <Footer />
        </>
    );
};

export default UserProfile;
