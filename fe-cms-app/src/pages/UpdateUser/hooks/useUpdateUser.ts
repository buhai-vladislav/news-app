import { useFormik } from 'formik';
import { useState, useRef, useCallback, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { updateUserValidationSchema } from '../utils/validation';
import {
  HttpStatus,
  IAffectedResult,
  IMutation,
  IResponse,
} from '../../../shared/types';
import { useNavigate } from 'react-router-dom';
import { useErrorToast } from '../../../shared/hooks';
import { useUpdateUserByIdMutation } from '../../../store/api/user.api';
import { createFormData } from '../../../shared/utils/createFormData';
import {
  FormStep,
  UserDataFormValues,
} from '../../../components/SignUp/SignUp.props';
import { useAppDispatch, useAppSelector } from '../../../store/hooks/store';
import { resetUser } from '../../../store/slices/user.slice';

export const useUpdateUser = () => {
  const [selected, setSelected] = useState(FormStep.FORM);
  const imageRef = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File | string>('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.userSlice);
  const [updateUser, { error }] = useUpdateUserByIdMutation();

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
    async (values: UserDataFormValues) => {
      const { confirmPassword, ...rest } = values;
      const formDatas = createFormData(rest);

      if (typeof image !== 'string') {
        formDatas.append('file', image);
      }

      const response: IMutation<IResponse<IAffectedResult>> = await updateUser({
        userData: formDatas,
        userId: user?.id!,
      });

      if (response?.data?.data) {
        localStorage.clear();
        dispatch(resetUser());
        navigate('/login');
      }
    },
    [image, user],
  );

  const formik = useFormik<UserDataFormValues>({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit,
    validationSchema: updateUserValidationSchema,
    validateOnChange: false,
    enableReinitialize: true,
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

  useEffect(() => {
    if (user) {
      formik.setValues({
        fullname: user.fullname,
        email: user.email,
        password: '',
        confirmPassword: '',
      });

      if (user.avatar && typeof user.avatar !== 'string') {
        setImage(user.avatar.fileSrc);
      }
    }
  }, [user]);

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
