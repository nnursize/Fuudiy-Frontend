// src/pages/Register.js
import React, { useEffect, useState } from 'react';
import { 
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Link as MuiLink,
  Alert
} from '@mui/material';
import { 
  FaUser as UserIcon,
  FaLock as LockIcon 
} from "react-icons/fa";
import { MdEmail as EmailIcon } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Frame from '../components/Frame';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Register = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();

  // State for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    document.body.classList.add('frame-body');
    return () => {
      document.body.classList.remove('frame-body');
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => console.log(`Language changed to: ${lng}`))
      .catch((err) => console.error("Language switch failed:", err));
  };

  const parseValidationError = (errorData) => {
    if (!errorData.detail) return 'Registration failed';
    
    // Handle FastAPI validation errors (422 Unprocessable Entity)
    if (Array.isArray(errorData.detail)) {
      const newFieldErrors = { username: '', email: '', password: '' };
      let generalError = '';
      
      errorData.detail.forEach(error => {
        const field = error.loc[error.loc.length - 1];
        const message = error.msg;
        
        if (field === 'email') {
          newFieldErrors.email = message.includes('valid email') 
            ? t('errors.invalid_email') 
            : message;
        } 
        else if (field === 'password') {
          newFieldErrors.password = t('errors.weak_password');
        }
        else if (field === 'username') {
          newFieldErrors.username = t('errors.invalid_username');
        }
        else {
          generalError = message;
        }
      });
      
      setFieldErrors(newFieldErrors);
      return generalError || t('errors.validation_error');
    }
    
    // Handle other error types
    return errorData.detail || 'Registration failed';
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({ username: '', email: '', password: '' });
  
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const friendlyError = parseValidationError(errorData);
        setErrorMsg(friendlyError);
        return;
      }
  
      const data = await response.json();
      localStorage.setItem('accessToken', data.access_token);
      navigate('/survey');
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMsg(t('errors.network_error'));
    }
  };

  return (
    <Frame title={t('register')} onSubmit={handleRegisterSubmit}>
      <Box sx={{ position: 'absolute', top: '35px', right: '35px' }}>
        <LanguageSwitcher 
          changeLanguage={changeLanguage} 
          size="large" 
          height="35px" 
          width="35px" 
          fontSize="0.8rem" 
          color="white" 
        />
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <TextField 
        required
        fullWidth
        variant="outlined"
        placeholder={t('username')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!fieldErrors.username}
        helperText={fieldErrors.username}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <UserIcon color={fieldErrors.username ? "error" : "primary"} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: '40px',
            height: '50px',
            backgroundColor: 'transparent',
            border: '2px solid',
            borderColor: theme => fieldErrors.username 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
            '& input': {
              color: theme => fieldErrors.username 
                ? theme.palette.error.main 
                : theme.palette.primary.main,
            },
          },
        }}
      />

      <TextField 
        required
        fullWidth
        variant="outlined"
        type="email"
        placeholder={t('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color={fieldErrors.email ? "error" : "primary"} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: '40px',
            height: '50px',
            backgroundColor: 'transparent',
            border: '2px solid',
            borderColor: theme => fieldErrors.email 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
            '& input': {
              color: theme => fieldErrors.email 
                ? theme.palette.error.main 
                : theme.palette.primary.main,
            },
          },
        }}
      />

      <TextField 
        required
        fullWidth
        type="password"
        variant="outlined"
        placeholder={t('password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color={fieldErrors.password ? "error" : "primary"} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: '40px',
            height: '50px',
            backgroundColor: 'transparent',
            border: '2px solid',
            borderColor: theme => fieldErrors.password 
              ? theme.palette.error.main 
              : theme.palette.primary.main,
            '& input': {
              color: theme => fieldErrors.password 
                ? theme.palette.error.main 
                : theme.palette.primary.main,
            },
          },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.primary">
          {t('have_account')}{' '}
          <MuiLink 
            component={Link} 
            to="/login" 
            color="primary"
            fontWeight="bold"
          >
            {t('login')}
          </MuiLink>
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{
          height: '50px',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        {t('register')}
      </Button>
    </Frame>
  );
};

export default Register;