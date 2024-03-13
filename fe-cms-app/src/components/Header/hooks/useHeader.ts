import { Key, useCallback, useState } from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { useErrorToast } from '../../../shared/hooks';
import {
  IMutation,
  IResponse,
  IAffectedResult,
  HttpStatus,
} from '../../../shared/types';
import { useLogoutMutation } from '../../../store/api/auth.api';
import { useAppSelector, useAppDispatch } from '../../../store/hooks/store';
import { resetUser } from '../../../store/slices/user.slice';

const tabs = [
  {
    key: 'posts',
    title: 'Posts',
  },
  {
    key: 'users',
    title: 'Users',
  },
  {
    key: 'tags',
    title: 'Tags',
  },
  {
    key: 'mixins',
    title: 'Mixins',
  },
];

export const useHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.userSlice);

  const [logout, { error, isLoading }] = useLogoutMutation();

  const logoutHandler = useCallback(async () => {
    const token = localStorage.getItem('refreshToken');

    if (token) {
      const response: IMutation<IResponse<IAffectedResult>> = await logout({
        refreshToken: token,
      });

      if (response.data?.data?.isAffected) {
        localStorage.clear();
        dispatch(resetUser());
        navigate('/login');
      }
    }
  }, []);

  const handleNavigate = useCallback(
    (path: string) => () => {
      navigate(path);
    },
    [],
  );

  const handleActive = useCallback(
    (path: string) => {
      return location.pathname.includes(path);
    },
    [location],
  );

  useErrorToast(
    error,
    [
      { status: HttpStatus.BAD_REQUEST },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    ],
    { position: 'bottom-center', type: 'error' },
  );

  return {
    user,
    tabs,
    isLoading,
    handleActive,
    logoutHandler,
    handleNavigate,
  };
};
