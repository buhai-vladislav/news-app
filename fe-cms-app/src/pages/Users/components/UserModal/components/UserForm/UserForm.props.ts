import { FormikProps } from 'formik';
import { UserFormValues } from '../../UserModal.props';

export type UserFormProps = {
  formik: FormikProps<UserFormValues>;
};
