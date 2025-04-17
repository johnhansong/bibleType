import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from '../context/themeContext';

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { toast } from 'react-toastify';
import errorMapping from '../Utils/errorMapping';

const SignupForm = ({handleClose}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const { theme } = useTheme()

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      toast.warning("Please complete all fields!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account Successfully Created!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              handleClose();
    } catch (err) {
      toast.error(errorMapping[err.code] || 'Unable to create user. Please try again', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
    }
  }

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: '21px'
      }}
    >
      <TextField
        variant='outlined'
        type='email'
        label='Enter Email'
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          '& .MuiInputLabel-root': { color: theme.textColor },
          '& .MuiInputBase-input': { color: theme.textColor }
        }}/>
      <TextField
        variant='outlined'
        type='password'
        label='Enter Password'
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          '& .MuiInputLabel-root': { color: theme.textColor },
          '& .MuiInputBase-input': { color: theme.textColor }
        }}/>
      <TextField
        variant='outlined'
        type='password'
        label='Confirm Password'
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{
          '& .MuiInputLabel-root': { color: theme.textColor },
          '& .MuiInputBase-input': { color: theme.textColor }
        }}/>
      <Button
        variant='contained'
        size='large'
        style={{
          backgroundColor: theme.background,
          color: theme.textColor
        }}
        onClick={handleSubmit}
      >Sign Up</Button>
    </Box>
  )
}

export default SignupForm
