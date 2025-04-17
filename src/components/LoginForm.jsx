import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTheme } from '../context/themeContext';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import errorMapping from '../Utils/errorMapping';

const LoginForm = ({handleClose}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme()

  const handleSubmit = async () => {
    if (!email || !password) {
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

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("Log in successful!", {
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
      toast.error(errorMapping[err.code] || 'Unable to sign in. Please try again.', {
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
        onClick={handleSubmit}
      >Login</Button>
    </Box>
  )
}

export default LoginForm
