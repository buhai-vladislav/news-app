import { useCallback, useState } from 'react';
import { useLoginMutation } from '../../../store/api/auth.api';
import { useAppDispatch } from '../../../store/hooks/store';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../../store/slices/user.slice';
import { useFormik } from 'formik';
import { ILoginFormValues } from '../Login.props';
import { validationSchema } from '../utils/validation';
import { useErrorToast } from '../../../shared/hooks';
import {
  HttpStatus,
  IMutation,
  IResponse,
  ITokenPair,
  IUser,
} from '../../../shared/types';
import { useLazyGetMeQuery } from '../../../store/api/user.api';

export const useLogin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginMutation, { error }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  const onSubmit = useCallback(async ({ email, password }: any) => {
    const response: IMutation<IResponse<ITokenPair>> = await loginMutation({
      email,
      password,
    });

    if (response?.data?.data) {
      localStorage.setItem('accessToken', response.data.data?.accessToken);
      localStorage.setItem('refreshToken', response.data.data?.refreshToken);

      const meResponse = await getMe();

      if (meResponse?.data?.data) {
        dispatch(setUser(meResponse.data?.data));
        navigate('/');
      }
    }
  }, []);

  const formik = useFormik<ILoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
    validationSchema,
    validateOnChange: false,
  });

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  useErrorToast(
    error,
    [{ status: HttpStatus.BAD_REQUEST }, { status: HttpStatus.UNAUTHORIZED }],
    { position: 'bottom-center', type: 'error' },
  );

  return {
    formik,
    isVisible,
    toggleVisibility,
  };
};
