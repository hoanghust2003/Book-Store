import { Switch } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { IoMoon, IoSunnyOutline } from 'react-icons/io5';
import './dark-mode-switch.css'
const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useState(false)

    const enableDarkMode = () => {}
    const disableDarkMode = () => {}
  return (
    <div className="dark-mode-switch">
      <Switch
        size="lg"
        color="success"
        startContent={<IoSunnyOutline />}
        endContent={<IoMoon />}
        isSelected={darkMode}
        onChange={(e)=>{
          const {checked} = e.target
          if (checked) enableDarkMode()
            else disableDarkMode()
        }}
      />
    </div>
  )
};

export default DarkModeSwitch;