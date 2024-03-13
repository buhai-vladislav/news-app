import { useFormik } from 'formik';
import { useState, useRef, Key, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { FormStep, UserDataFormValues } from '../SignUp.props';
import { validationSchema } from '../utils/validation';
import { useSignupMutation } from '../../../store/api/auth.api';
import {
  HttpStatus,
  IAffectedResult,
  IMutation,
  IResponse,
} from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { useErrorToast } from '../../../shared/hooks';

export const useSignUp = () => {
  const [selected, setSelected] = useState(FormStep.FORM);
  const imageRef = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File | string>('');
  const navigate = useNavigate();

  const [signUp, { error }] = useSignupMutation();

  const tabs = [
    {
      key: FormStep.FORM,
      title: 'Data',
    },
    {
      key: FormStep.AVATAR,
      title: 'Avatar',
    },
  ];

  const onSubmit = useCallback(
    async (value: UserDataFormValues) => {
      const formData = new FormData();

      formData.append('fullname', value.fullname);
      formData.append('email', value.email);
      formData.append('password', value.password);
      formData.append('file', image);
      formData.append('role', 'USER');

      const response: IMutation<IResponse<IAffectedResult>> =
        await signUp(formData);

      if (response?.data?.data) {
        navigate('/login');
      }
    },
    [image],
  );

  const formik = useFormik<UserDataFormValues>({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit,
    validationSchema,
    validateOnChange: false,
  });

  const handleStep = useCallback(async () => {
    if (selected === FormStep.FORM) {
      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        return;
      }

      setSelected(FormStep.AVATAR);
    } else {
      setSelected(FormStep.FORM);
    }
  }, [selected]);

  useErrorToast(error, [{ status: HttpStatus.BAD_REQUEST }], {
    position: 'bottom-center',
    type: 'error',
  });

  return {
    selected,
    tabs,
    formik,
    image,
    imageRef,
    setImage,
    handleStep,
  };
};
