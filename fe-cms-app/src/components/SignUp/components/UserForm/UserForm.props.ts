import { FormikProps } from 'formik';
import { UserDataFormValues } from '../../SignUp.props';

export type UserFormProps = {
  formik: FormikProps<UserDataFormValues>;
};
