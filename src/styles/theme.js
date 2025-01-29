import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A02334',
    },
    secondary: {
      main: '#FFAD60',
    },
    background: {
      main: '#FFEEAD',
      default: '#f5f5f5',
    },
    highlight: {
      main: '#96CEB4',
    },
  },
  typography: {
    fontFamily: 'Poppins,  sans-serif', // Use Poppins
    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Poppins,  sans-serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'Poppins, Arial, sans-serif',
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: 'Poppins, Arial, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.015em',
    },
    body2: {
      fontFamily: 'Poppins, Arial, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.015em',
    },
    button: {
      fontFamily: 'Poppins,  sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    caption: {
      fontFamily: 'Poppins, Arial, sans-serif',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontFamily: 'Poppins, Arial, sans-serif',
      fontSize: '0.75rem',
      fontWeight: 400,
      textTransform: 'uppercase',
    },
  },
});

export default theme;
