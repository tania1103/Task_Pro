import * as yup from 'yup';

const editUserSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Maximum name length is 32 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Invalid email format'
    ),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Maximum password length is 64 characters')
    .matches(/^\S+$/, 'Password cannot contain spaces'),
});

export default editUserSchema;
