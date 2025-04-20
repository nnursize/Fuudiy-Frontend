import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const RefreshPopup = ({ open, onStayLoggedIn, onLogout }) => {
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Call the original logout function
        navigate("/"); // Redirect to home page
    };

    useEffect(() => {
      if (!open) return;
  
      // Reset timer when popup opens
      setTimeLeft(60);
      
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleLogout(); // Use our custom logout handler
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, [open, handleLogout]);
  
    if (!open) return null;

    return (
        <Overlay>
            <Popup>
                <Message>Are you still there?</Message>
                <Timer>Your session will expire in {timeLeft} seconds</Timer>
                <Buttons>
                    <Button onClick={onStayLoggedIn}>Yes, I'm here</Button>
                    <Button onClick={handleLogout}>No, Log me out</Button>
                </Buttons>
            </Popup>
        </Overlay>
    );
};

export default RefreshPopup;

// Styled-components remain the same
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Popup = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const Timer = styled.div`
  font-size: 0.9rem;
  color:rgba(0, 0, 0, 0.41);
  margin-bottom: 20px;
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  background: #007bff;
  color: white;
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text};

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
  }
`;