import { FormikProps } from 'formik';
import { UserRole } from '../../../../shared/types';

export type UserFormValues = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

export type UserModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  title: string;
  formik: FormikProps<UserFormValues>;
};
