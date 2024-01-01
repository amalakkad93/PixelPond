import React, { useContext } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { themeName, setThemeName } = useTheme();

  const toggleTheme = () => {
    setThemeName(themeName === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`theme-toggle ${themeName}`}>
      <input
        type="checkbox"
        className="checkbox"
        id="chk"
        checked={themeName === 'dark'}
        onChange={toggleTheme}
      />
      <label className="label" htmlFor="chk">
        <i className={`fas fa-moon ${themeName === 'dark' ? 'icon-hidden' : ''}`}></i>
        <div className="ball"></div>
        <i className={`fas fa-sun ${themeName === 'light' ? 'icon-hidden' : ''}`}></i>
      </label>
    </div>
  );
}


export default ThemeToggle;
