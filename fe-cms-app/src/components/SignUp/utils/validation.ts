import { object, string, ref } from 'yup';

export const validationSchema = object({
  fullname: string().required('Fullname is required'),
  email: string().email('Invalid email format.').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords do not match')
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters'),
});
