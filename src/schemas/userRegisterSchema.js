import * as yup from 'yup';

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(25, 'Maximum name length is 25 symbols')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(24, 'Maximum password length is 24 symbols')
    .required('Password is required'),
});

export default registerSchema;
