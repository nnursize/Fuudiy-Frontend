import { createTheme } from '@mui/material/styles';

// Color palette with semantic names and variations
const colors = {
  primary: {
    main: '#5E362F',
    light: '#b88c6e',
    dark: '#4b2f18',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FFAD60',
    light: '#FFD699',
    dark: '#CC8A4D',
    contrastText: '#000000',
  },
  background: {
    main: '#F5E8DC',
    default: '#f5f5f5',
    paper: '#FFFFFF',
  },
  highlight: {
    main: '#96CEB4',
    light: '#C4E7D4',
    dark: '#6AA68C',
    contrastText: '#000000',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
  },
  text: {
    primary: '#000000',
    secondary: '#A02334',
    disabled: '#9E9E9E',
  },
};

// Typography settings with responsive variants
const typography = {
  fontFamily: 'Poppins, sans-serif',
  htmlFontSize: 16,
  h1: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.015em',
    '@media (max-width:900px)': {
      fontSize: '2.5rem',
    },
    '@media (max-width:600px)': {
      fontSize: '2rem',
    },
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    '@media (max-width:900px)': {
      fontSize: '2rem',
    },
    '@media (max-width:600px)': {
      fontSize: '1.75rem',
    },
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.75,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.015em',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.015em',
  },
  button: {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

// Component-specific customizations
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 22px',
        textTransform: 'none',
        fontSize: '1rem',
        '@media (max-width:600px)': {
          fontSize: '0.875rem',
          padding: '6px 18px',
        },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
          backgroundColor: `${colors.primary.dark} !important`,
        },
        '&.MuiButton-primary': {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
        },
        '&.MuiButton-secondary': {
          backgroundColor: colors.secondary.main,
          color: colors.secondary.contrastText,
        },
      },
      outlined: {
        borderColor: colors.primary.main,
        color: colors.primary.main,
        '&:hover': {
          backgroundColor: `${colors.primary.light}`,
          borderColor: colors.primary.main,
        },
      },
    },
    variants: [
      {
        props: { variant: 'dashed' },
        style: {
          border: `2px dashed ${colors.primary.main}`,
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.light,
            borderColor: colors.primary.dark,
          },
        },
      },
    ],
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      fullWidth: true,
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: colors.primary.dark,
      },
    },
  },
};

// Breakpoints configuration
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Create the theme with all configurations
const theme = createTheme({
  palette: colors,
  typography,
  components,
  breakpoints,
  spacing: 8, // Base spacing unit (8px)
  shape: {
    borderRadius: 8, // Default border radius
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});

// Add responsive font sizes
theme.typography = {
  ...theme.typography,
  h1: {
    ...theme.typography.h1,
    [theme.breakpoints.down('md')]: {
      fontSize: '2.25rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  h2: {
    ...theme.typography.h2,
    [theme.breakpoints.down('md')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
};

export default theme;