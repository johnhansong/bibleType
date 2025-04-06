import React from 'react'
import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Tabs, Tab, AppBar, Modal } from '@mui/material'

import { useTheme } from '../context/themeContext'

const AccountCircle = () => {
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(0);
  const { theme } = useTheme()

  const handleValueChange = (e, val) => {
    // We are using MUI component, Tabs, which will go back and forth between the number of tabs we have
    // in this case 0 and 1
    setValue(val)
  }

  return (
    <div>
      <AccountCircleIcon onClick={() => setOpenModal(true)}/>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(7px)',
              backgroundColor: 'rgba(0,0,0,0.4)'
            }
          }
        }}
      >
        <div
          style={{
            width: '400px',
          }}
        >
          <AppBar
            position='static'
            style={{background:'transparent'}}
          >
            <Tabs
              value={value}
              onChange={handleValueChange}
              variant='fullWidth'
            >
              <Tab
                label='login'
                style={{
                  color: theme.textColor
                }}
              ></Tab>
              <Tab
                label='signup'
                style={{
                  color: theme.textColor
                }}
              ></Tab>
            </Tabs>
          </AppBar>
          {value === 0 && <LoginForm />}
          {value === 1 && <SignupForm />}

        </div>
      </Modal>

    </div>
  )
}

export default AccountCircle
