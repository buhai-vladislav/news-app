import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { IMutation, IResponse, IAffectedResult } from '../../../shared/types';
import { useDeleteUserByIdMutation } from '../../../store/api/user.api';

export const useDeleteUser = () => {
  const [deleteUser, { error, isLoading }] = useDeleteUserByIdMutation();

  const onDelete = useCallback(
    (id: string) => async () => {
      const response: IMutation<IResponse<IAffectedResult>> =
        await deleteUser(id);
      if (response?.data) {
        toast.success('User deleted successfully', {
          position: 'bottom-center',
        });
      }
    },
    [],
  );

  return { onDelete, error, isLoading };
};
