import { object, string } from 'yup';

export const validationSchema = object({
  email: string()
    .email("It's not a valid email.")
    .required('Email is required.'),
  password: string().required('Password is required.'),
});
