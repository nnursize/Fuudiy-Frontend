import React from 'react';
import loginBackground from '../assets/login_background.jpg';

import { 
  Box,
  Container,
  Paper,
  Typography,
  styled
} from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: 'rgba(239, 237, 185, 0.89)', // Fallback
  backgroundImage: `url(${loginBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  paddingLeft: '38%',
  
  [theme.breakpoints.down('xl')]: { paddingLeft: '32%' },
  [theme.breakpoints.down('lg')]: { paddingLeft: '22%' },
  [theme.breakpoints.down('md')]: { paddingLeft: '15%' },
  [theme.breakpoints.down('sm')]: { paddingLeft: '0' },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  opacity: 0.90,
  border: `2px solid ${theme.palette.primary.main}`,
  color: theme.palette.background.main,
  backdropFilter: 'blur(70px)',
  borderRadius: '30px',
  padding: theme.spacing(0.5),
  width: '100%',
  maxWidth: 450,
  
}));

const FormBox = styled('form')(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  opacity: 1.0,
  padding: theme.spacing(4),
  borderRadius: '25px',
  boxShadow: theme.shadows[4],
  backdropFilter: 'blur(20px)',
  width: '100%',
}));

const Frame = ({ title, onSubmit, children }) => {
  return (
    <StyledContainer maxWidth={false} >
      <StyledPaper elevation={0}>
        <FormBox onSubmit={onSubmit}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              mb: 4,
              color: theme => theme.palette.primary.main
            }}
          >
            {title}
          </Typography>
          {children}
        </FormBox>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Frame;