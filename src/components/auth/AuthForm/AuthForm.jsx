/**
 * AuthForm component for login and register
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Typography, 
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import Button from '../../common/Button';
import { login, register, selectAuthError, selectAuthStatus } from '../../../features/authSlice';

// Validation schema for login
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Validation schema for register
const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const AuthForm = ({ isLogin = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  
  const isLoading = status === 'loading';
  
  const initialValues = isLogin 
    ? { email: '', password: '' } 
    : { name: '', email: '', password: '' };
    
  const handleSubmit = (values) => {
    if (isLogin) {
      dispatch(login(values)).unwrap()
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          // Error handling is done in the Redux slice
        });
    } else {
      dispatch(register(values)).unwrap()
        .then(() => {
          navigate('/');
        })
        .catch(() => {
          // Error handling is done in the Redux slice
        });
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
            {isLogin ? 'Login to Task Pro' : 'Create an Account'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <Stack spacing={3}>
                  {!isLogin && (
                    <Field name="name">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Name"
                          fullWidth
                          error={Boolean(errors.name && touched.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </Field>
                  )}
                  
                  <Field name="email">
                    {({ field }) => (
                      <TextField
                        {...field}
                        type="email"
                        label="Email"
                        fullWidth
                        error={Boolean(errors.email && touched.email)}
                        helperText={touched.email && errors.email}
                      />
                    )}
                  </Field>
                  
                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        label="Password"
                        fullWidth
                        error={Boolean(errors.password && touched.password)}
                        helperText={touched.password && errors.password}
                      />
                    )}
                  </Field>
                  
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isLoading || !(isValid && dirty)}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isLogin ? 'Login' : 'Register'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link to={isLogin ? '/auth/register' : '/auth/login'}>
                {isLogin ? 'Register' : 'Login'}
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm;
