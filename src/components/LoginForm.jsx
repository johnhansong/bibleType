import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from '../context/themeContext';


const LoginForm = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme()

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
        }}
      />
      <TextField
        variant='outlined'
        type='password'
        label='Enter Password'
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          '& .MuiInputLabel-root': { color: theme.textColor },
          '& .MuiInputBase-input': { color: theme.textColor }
        }}
      />
      <Button
        variant='contained'
        size='large'
        style={{
          backgroundColor: theme.background,
          color: theme.textColor
        }}
      >Login</Button>
    </Box>
  )
}

export default LoginForm
