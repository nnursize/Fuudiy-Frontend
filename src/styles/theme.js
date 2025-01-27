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
    fontFamily: 'Poppins, Arial, sans-serif', // Use Poppins
  },
});

export default theme;
