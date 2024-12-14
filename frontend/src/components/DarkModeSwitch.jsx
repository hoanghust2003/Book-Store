import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IoMoon, IoSunnyOutline } from 'react-icons/io5';
import './dark-mode-switch.css'
// Custom MUI Switch
const DarkModeSwitchStyled = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#8796A5',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M10 2v16M2 10h16"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));
const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useState(false)

    
    const updateLocalStorage = (themeMode) => {
      if (themeMode) localStorage.setItem("theme",themeMode)
        else localStorage.removeItem("theme")
    }

    const enableDarkMode = () => {
      document.documentElement.classList.add("dark")
      updateLocalStorage("dark")
      setDarkMode(true)
    }
    const disableDarkMode = () => {
      document.documentElement.classList.remove("dark")
      updateLocalStorage()
      setDarkMode(false);
    }

    useEffect(() => {
      const result = localStorage.getItem('theme')
      if (result == "dark"){
        enableDarkMode()
      }
    }, [])

    const handleSwitchChange = () => {
      if (!darkMode) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IoSunnyOutline style={{ marginRight: '8px' }} />
      <FormControlLabel
        control={
          <DarkModeSwitchStyled
            checked={darkMode}
            onChange={handleSwitchChange}
            inputProps={{ 'aria-label': 'dark mode toggle' }}
          />
        }
        label=""
      />
      <IoMoon style={{ marginLeft: '0px' }} />
    </div>
  );
};

export default DarkModeSwitch;