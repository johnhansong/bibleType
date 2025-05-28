import React from 'react'
import Select from 'react-select'
import { themeOptions } from '../Utils/themeOptions'
import { useTheme } from '../context/themeContext'

const Footer = () => {
  const {theme, setTheme} = useTheme()

  const handleThemeChange = (e) => {
    setTheme(e.value);
    localStorage.setItem("theme", JSON.stringify(e.value))
  }

  return (
    <div className='footer'>
      <div className="links">
        links
      </div>

      <div className="footer-dropdowns">
        <div className="versionButton">

        </div>
        <div className="themeButton">
          <Select
            onChange={handleThemeChange}
            options={themeOptions}
            menuPlacement='top'
            placeholder={theme.label}
            styles={{
              control: (styles, { isFocused }) => ({...styles,
                backgroundColor: theme.background,
                color: theme.textColor,
                borderColor: isFocused ? theme.accent : theme.textColor,
                boxShadow: isFocused ? `0 0 0 1px ${theme.accent}` : 'none',
                '&:hover': {
                  borderColor: theme.accent,
                }
              }),
              placeholder: styles => ({
                ...styles,
                color: theme.textColor,
              }),
              singleValue: styles => ({
                ...styles,
                color: theme.textColor,
              }),
              menu: styles => ({...styles,
                                backgroundColor: theme.background,
                              }),
              option: (styles, {isFocused}) => ({
                  ...styles,
                  backgroundColor: !isFocused ? theme.background : theme.accent,
                  cursor: 'pointer',
              }),
              input: styles => ({
                ...styles,
                color: theme.textColor,
              }),
              dropdownIndicator: styles => ({
                ...styles,
                color: theme.textColor,
                '&:hover': {
                  color: theme.accent,
                }
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Footer
