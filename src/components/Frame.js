// src/components/Frame.js
import React from 'react';
import { 
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: theme.palette.background.main, // Matching RadioMatrix background
  paddingLeft: '38%',
  
  [theme.breakpoints.down('xl')]: { paddingLeft: '32%' },
  [theme.breakpoints.down('lg')]: { paddingLeft: '22%' },
  [theme.breakpoints.down('md')]: { paddingLeft: '15%' },
  [theme.breakpoints.down('sm')]: { paddingLeft: '0' },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  borderRadius: '20px',
  padding: theme.spacing(3),
  width: '100%',
  maxWidth: 450,
  boxShadow: theme.shadows[4], // Matching RadioMatrix elevation
}));

const FormBox = styled('form')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  borderRadius: '10px',
  width: '100%',
}));

const Frame = ({ title, onSubmit, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledContainer maxWidth={false}>
      <StyledPaper elevation={0}>
        <Box sx={{ 
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1
        }}>
          <IconButton sx={{ 
            color: theme.palette.text.secondary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '50px',
            fontSize: '0.8125rem',
            padding: '4px 8px',
            '&:hover': { 
              backgroundColor: theme.palette.action.hover 
            }
          }}>
            EN
          </IconButton>
          <IconButton sx={{ 
            color: theme.palette.text.secondary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '50px',
            fontSize: '0.8125rem',
            padding: '4px 8px',
            '&:hover': { 
              backgroundColor: theme.palette.action.hover 
            }
          }}>
            TR
          </IconButton>
        </Box>

        <FormBox onSubmit={onSubmit}>
          <Typography variant="h4" sx={{ 
            fontSize: '28px',
            textAlign: 'center',
            color: theme.palette.text.primary,
            mb: 2
          }}>
            {title}
          </Typography>
          
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '40px',
                    height: 50,
                    color: theme.palette.text.primary,
                    '& fieldset': {
                      borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '12px 20px',
                    '&::placeholder': {
                      color: theme.palette.text.secondary,
                      opacity: 1,
                    },
                  },
                },
                InputProps: {
                  endAdornment: child.props.icon && (
                    <InputAdornment position="end" sx={{ mr: 1.5 }}>
                      {child.props.icon}
                    </InputAdornment>
                  ),
                },
              });
            }
            return child;
          })}
          
          <Button
            fullWidth
            variant="contained"
            sx={{
              height: 50,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              '&:hover': { 
                bgcolor: theme.palette.primary.dark 
              }
            }}
          >
            Login
          </Button>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
            gap: 2.5
          }}>
            <Typography 
              component="span" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 600,
                '&:hover': { 
                  textDecoration: 'underline',
                  color: theme.palette.text.primary
                },
                cursor: 'pointer'
              }}
            >
              Don't have an account?
            </Typography>
            <Typography 
              component="span" 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': { 
                  textDecoration: 'underline',
                  color: theme.palette.primary.dark
                },
                cursor: 'pointer'
              }}
            >
              Register
            </Typography>
          </Box>
        </FormBox>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Frame;