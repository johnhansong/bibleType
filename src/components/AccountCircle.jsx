import React from 'react'
import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Tabs, Tab, AppBar, Modal } from '@mui/material'

const AccountCircle = () => {

  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(0);

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
              <Tab label='login'></Tab>
              <Tab label='signup'></Tab>
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
