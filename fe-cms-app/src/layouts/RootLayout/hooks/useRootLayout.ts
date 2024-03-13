import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyGetMeQuery } from '../../../store/api/user.api';
import { useAppDispatch, useAppSelector } from '../../../store/hooks/store';
import { setUser, resetUser } from '../../../store/slices/user.slice';

export const useRootLayout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userSlice);
  const [getMe, { data, isError }] = useLazyGetMeQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.data) {
      dispatch(setUser(data.data));
      navigate('/');
    }
    if (isError) {
      dispatch(resetUser());
      navigate('/login');
    }
  }, [data, isError]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      getMe();
    }
  }, []);

  return { user };
};
