import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const TransparentTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    borderRadius: 20,
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff',
    },
    '& input': {
      color: '#fff',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  }
}));

export default function SearchBar() {
  const { t, i118n } = useTranslation('global');
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // 1) Perform the fetch
  const fetchSuggestions = async (q) => {
    if (!q.trim()) {
      setOptions([]);
      setLoading(false);
      return;
    }
    
    try {
      console.log('[SearchBar] fetching:', q);
      // Using absolute URL to ensure the API is hit correctly
      const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { results } = await res.json();
      console.log('[SearchBar] got:', results);
      setOptions(results || []);
    } catch (err) {
      console.error('[SearchBar] fetch error:', err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // 2) Debounce it so we only fire once per 300ms
  const debounced = useRef(
    debounce((q) => {
      setLoading(true);
      fetchSuggestions(q);
    }, 300)
  ).current;

  // 3) Kick off on input change
  useEffect(() => {
    if (inputValue.trim()) {
      debounced(inputValue.trim());
      // Make sure dropdown is open when typing
      setOpen(true);
    } else {
      setOptions([]);
      setLoading(false);
    }
    
    // Clean up debounce on unmount
    return () => {
      debounced.cancel();
    };
  }, [inputValue, debounced]);

  // 4) When user picks an item
  const handleSelect = (_, value) => {
    if (!value) return;
    const { type, id } = value;
    setInputValue('');
    setOptions([]);
    navigate(type === 'food' ? `/food/${id}` : `/profile/${id}`);
  };

  // Debugging help - add this to monitor important state changes
  useEffect(() => {
    console.log('State update:', { 
      inputLength: inputValue.length,
      optionsCount: options.length, 
      loading, 
      open 
    });
  }, [inputValue, options, loading, open]);

  return (
    <Box sx={{ width: '60%', maxWidth: 800, mt: 4, mx: 'auto' }}>
      <Autocomplete
        freeSolo
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        forcePopupIcon={false}
        // Always show server options, skip MUI's filter
        filterOptions={(x) => x}
        options={options}
        getOptionLabel={(opt) => opt.name || ''}
        loading={loading}
        loadingText={t('searching')}
        noOptionsText={inputValue.trim() ? t('noResults') : t('typeToSearch')}
        // Control input state
        inputValue={inputValue}
        onInputChange={(_, v) => setInputValue(v)}
        onChange={handleSelect}
        // Transparent, frosted‑glass dropdown
        PaperComponent={({ children, ...props }) => (
          <Box
            {...props}
            sx={{
              background: 'rgba(0, 107, 117, 0.51)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 2,
              mt: 1,
              color: '#fff',
            }}
          >
            {children}
          </Box>
        )}
        // Loading spinner
        renderInput={(params) => (
          <TransparentTextField
            {...params}
            placeholder={t('searchPlaceholder')}
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ mr: 1 }}
                    />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        // White text options, hover highlight
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={`${option.type}-${option.id}`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#fff',
              '&:hover': { background: 'rgba(255,255,255,0.2)' },
              px: 2, py: 1,
            }}
          >
            <Typography>{option.name}  </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {option.type === 'food' ? '  🍽️' : '  👤'}
            </Typography>
        </Box>
        )}
        sx={{
          // ensure the listbox has no default MUI padding
          '& .MuiAutocomplete-listbox': {
            p: 0,
          },
        }}
      />
    </Box>
  );
}