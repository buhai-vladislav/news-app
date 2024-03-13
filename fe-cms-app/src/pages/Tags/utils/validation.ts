import { object, string } from 'yup';

export const tagValidationSchema = object({
  name: string().required('Name is required'),
});
