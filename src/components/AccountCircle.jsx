import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import GoogleButton from 'react-google-button'
import { auth } from '../firebaseConfig'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useAuth } from '../context/authContext'
import errorMapping from '../Utils/errorMapping'
import { toast } from 'react-toastify'
import { Tabs, Tab, AppBar, Modal, Box } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'

import { useTheme } from '../context/themeContext'

const AccountCircle = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(0);
  const { theme } = useTheme()
  const { user } = useAuth()

  const handleValueChange = (e, val) => {
    // We are using MUI component, Tabs, which will go back and forth between the number of tabs we have
    // in this case 0 and 1
    setValue(val)
  }

  const handleModalOpen = () => {
    if (user) {
      navigate('/user')
    } else {
      setOpenModal(true)
    }
  }

  const handleModalClose = () => {
    setOpenModal(false)
  }

  const googleProvider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider).then((res) => {
      toast.success("Login success", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      handleModalClose();
    }).catch((err) => {
      toast.error(errorMapping[err.code] || 'An error occurred. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    })
  }

  const handleLogout = () => {
    auth.signOut().then((res) => {
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }).catch((err) => {
      toast.error("Unable to log out. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    })
  }

  return (
    <div>
      <AccountCircleIcon onClick={() => setOpenModal(true)}/>

        {user && <LogoutIcon onClick={handleLogout}/>}

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
            textAlign: 'center',
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
          {value === 0 && <LoginForm handleClose={handleModalClose}/>}
          {value === 1 && <SignupForm handleClose={handleModalClose}/>}

          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span>OR</span>
            <GoogleButton
              style={{
                margin: '8px',
                width: '90%',
              }}
              onClick={handleGoogleSignIn}
            />
          </Box>
        </div>
      </Modal>

    </div>
  )
}

export default AccountCircle
