import { useDisclosure } from '@nextui-org/react';
import { useCreateUserMutation } from '../../../store/api/user.api';
import { useCallback, useEffect } from 'react';
import { UserFormValues } from '../components/UserModal/UserModal.props';
import { createFormData } from '../../../shared/utils/createFormData';
import {
  HttpStatus,
  IAffectedResult,
  IMutation,
  IResponse,
  UserRole,
} from '../../../shared/types';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { userValidationSchema } from '../utils/validation';
import { useErrorToast } from '../../../shared/hooks';

export const useCreateUser = () => {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [createUser, { error }] = useCreateUserMutation();

  const onSubmit = useCallback(async (values: UserFormValues) => {
    const { confirmPassword, ...rest } = values;
    const formData = createFormData(rest);

    const response: IMutation<IResponse<IAffectedResult>> =
      await createUser(formData);

    if (response?.data) {
      toast.success('User created successfully', { position: 'bottom-center' });
      onClose();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.USER,
    },
    onSubmit,
    validateOnChange: false,
    validationSchema: userValidationSchema,
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  useErrorToast(error, [
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: 'Failed to create user',
    },
    {
      status: HttpStatus.BAD_REQUEST,
      errorMessage: 'Failed to create user',
    },
  ]);

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
    formik,
  };
};
