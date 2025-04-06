import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from '../context/themeContext';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SignupForm = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const { theme } = useTheme()

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please complete all fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account successfully created!')
    } catch (err) {
      alert('Unable to create user. Please try again!')
      console.error(err);
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
      >Login</Button>
    </Box>
  )
}

export default SignupForm
