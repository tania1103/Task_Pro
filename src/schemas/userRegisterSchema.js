import * as yup from 'yup';

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Maximum name length is 32 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Maximum password length is 64 characters')
    .matches(/^\S+$/, 'Password cannot contain spaces')
    .required('Password is required'),
});

export default registerSchema;
