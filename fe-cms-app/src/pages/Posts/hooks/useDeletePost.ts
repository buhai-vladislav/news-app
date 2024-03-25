import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  IMutation,
  IResponse,
  IPost,
  IAffectedResult,
  HttpStatus,
} from '../../../shared/types';
import { createFormData } from '../../../shared/utils/createFormData';
import {
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../../../store/api/post.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrorToast } from '../../../shared/hooks';

export const useDeletePost = (post: Partial<IPost>) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [updatePost, { isLoading: updatePostLoading, error: updatePostError }] =
    useUpdatePostMutation();
  const [deletePost, { isLoading: deletePostLoading, error: deletePostError }] =
    useDeletePostMutation();

  const handleArchivePost = useCallback(async () => {
    if (!confirm('Are you sure you want to archive this post?') || !postId)
      return;

    const body = createFormData({
      deletedAt:
        post?.deletedAt === null || post?.deletedAt === undefined
          ? new Date().toISOString()
          : null,
    });
    const response: IMutation<IResponse<IPost>> = await updatePost({
      id: postId!,
      body,
    });

    if (response?.data) {
      toast.success('Post archived successfully', {
        position: 'bottom-center',
      });
    }
  }, [post, postId]);

  const handleDeletePost = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this post?') || !postId)
      return;

    const response: IMutation<IResponse<IAffectedResult>> = await deletePost(
      postId!,
    );

    if (response?.data) {
      navigate('/posts');
      toast.success('Post deleted successfully', {
        position: 'bottom-center',
      });
    }
  }, [post, postId]);

  useErrorToast(updatePostError || deletePostError, [
    { status: HttpStatus.BAD_REQUEST, errorMessage: 'Something went wrong' },
    { status: HttpStatus.NOT_FOUND, errorMessage: 'Something went wrong' },
    { status: HttpStatus.UNAUTHORIZED, errorMessage: 'You are unauthorized' },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: 'Something went wrong',
    },
  ]);

  const isLoading = useMemo(
    () => updatePostLoading || deletePostLoading,
    [updatePostLoading, deletePostLoading],
  );

  return {
    isLoading,
    handleArchivePost,
    handleDeletePost,
  };
};
