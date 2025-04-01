import React from 'react'
import Select from 'react-select'
import { themeOptions } from '../Utils/themeOptions'
import { useTheme } from '../context/themeContext'

const Footer = () => {
  const {theme, setTheme} = useTheme()

  const handleChange = (e) => {
    setTheme(e.value);
    localStorage.setItem("theme", JSON.stringify(e.value))
  }

  return (
    <div className='footer'>
      <div className="links">
        links
      </div>
      <div className="themeButton">
        <Select
          onChange={handleChange}
          options={themeOptions}
          menuPlacement='top'
          styles={{
            control: styles => ({...styles,
                                  backgroundColor: theme.background,
                                  color: theme.textColor
                                }),
            menu: styles => ({...styles,
                              backgroundColor: theme.background,
                            }),
            option: (styles, {isFocused}) => ({
                ...styles,
                backgroundColor: !isFocused ? theme.background : theme.accent,
                cursor: 'pointer',
            }),
            placeholder: styles => ({
              ...styles,
              color: theme.textColor,
            }),
            input: styles => ({
              ...styles,
              color: theme.textColor,
            })
          }}
        />
      </div>
    </div>
  )
}

export default Footer
