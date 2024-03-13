import { object, ref, string } from 'yup';

export const userValidationSchema = object({
  fullname: string().required('Fullname is required'),
  email: string().email('Invalid email format.').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords do not match')
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters'),
  role: string().required('Role is required'),
});

export const userUpdateValidationSchema = object({
  fullname: string().required('Fullname is required'),
  email: string().email('Invalid email format.').required('Email is required'),
  role: string().required('Role is required'),
  password: string()
    .optional()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords do not match')
    .optional()
    .min(6, 'Confirm password must be at least 6 characters'),
});
