import { useDisclosure } from '@nextui-org/react';
import { useUpdateUserByIdMutation } from '../../../store/api/user.api';
import { useCallback, useEffect, useState } from 'react';
import { UserFormValues } from '../components/UserModal/UserModal.props';
import { createFormData } from '../../../shared/utils/createFormData';
import {
  IAffectedResult,
  IMutation,
  IResponse,
  IUser,
  UserRole,
} from '../../../shared/types';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { userUpdateValidationSchema } from '../utils/validation';

export const useUpdateUser = () => {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [userId, setUserId] = useState<string>('');
  const [updateUser, { error }] = useUpdateUserByIdMutation();

  const onSubmit = useCallback(
    async (values: UserFormValues) => {
      if (!userId) return;

      const { confirmPassword, ...rest } = values;
      const formData = createFormData(rest);

      const response: IMutation<IResponse<IAffectedResult>> = await updateUser({
        userData: formData,
        userId,
      });

      if (response?.data) {
        toast.success('User updated successfully', {
          position: 'bottom-center',
        });
        onClose();
      }
    },
    [userId],
  );

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
    validationSchema: userUpdateValidationSchema,
  });

  const handleSelectUser = useCallback(
    (user: IUser) => () => {
      setUserId(user.id);
      console.log(user);
      formik.setValues({
        fullname: user.fullname,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role as UserRole,
      });

      onOpen();
    },
    [],
  );

  const onBanUser = useCallback(
    (user: Partial<IUser>) => async () => {
      const userData = createFormData({
        deletedAt: user?.deletedAt === null ? new Date().toISOString() : null,
      });

      const response: IMutation<IResponse<IAffectedResult>> = await updateUser({
        userData,
        userId: user.id!,
      });
      if (response?.data) {
        toast.success('User banned successfully', {
          position: 'bottom-center',
        });
      }
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
    onBanUser,
    handleSelectUser,
    formik,
    error,
  };
};
