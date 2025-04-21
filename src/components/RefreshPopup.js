import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RefreshPopup = ({ open, onStayLoggedIn, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const navigate = useNavigate();
  const { t } = useTranslation("global");
  const theme = useTheme();

  const handleLogout = () => {
    onLogout(); // Call the original logout function
    navigate("/"); // Redirect to home page
  };

  useEffect(() => {
    if (!open) return;

    setTimeLeft(60);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  if (!open) return null;

  return (
    <Overlay>
      <Popup>
        <Message>{t("refresh_popup.message")}</Message>
        <Timer>{t("refresh_popup.timer", { timeLeft })}</Timer>
        <Buttons>
          <StayButton theme={theme} onClick={onStayLoggedIn}>
            {t("refresh_popup.stay_logged_in")}
          </StayButton>
          <LogoutButton theme={theme} onClick={handleLogout}>
            {t("refresh_popup.logout")}
          </LogoutButton>
        </Buttons>
      </Popup>
    </Overlay>
  );
};

export default RefreshPopup;

// Styled-components
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
  color: rgba(0, 0, 0, 0.41);
  margin-bottom: 20px;
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StayButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};

  &:hover {
    background: ${({ theme }) => theme.palette.primary.dark};
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  background: ${({ theme }) => theme.palette.error.main};
  color: ${({ theme }) => theme.palette.error.contrastText};

  &:hover {
    background: ${({ theme }) => theme.palette.error.dark};
  }
`;
