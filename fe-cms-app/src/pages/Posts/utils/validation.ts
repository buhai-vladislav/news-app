import { Dispatch, SetStateAction } from 'react';
import { IPost, IPostBlock, PostBlockActionType } from '../../../shared/types';

export const validateSchema = (post: Partial<IPost>) => {
  const errors: Record<string, string> = {};

  if (post.title === '' || post.title === undefined) {
    errors['title'] = 'Title is required';
  }

  if (post.shortDescription === '' || post.shortDescription === undefined) {
    errors['shortDescription'] = 'Short description is required';
  }

  if (post.status === undefined) {
    errors['status'] = 'Status is required';
  }

  if (post?.tags?.length === 0 || post?.tags === undefined) {
    errors['tags'] = 'Tags are required';
  }

  if (
    post?.postBlocks?.length === 0 ||
    post?.postBlocks === undefined ||
    post?.postBlocks?.every(
      ({ actionType }) => actionType === PostBlockActionType.DELETE,
    )
  ) {
    errors['postBlocks'] = 'Post blocks are required';
  }

  return errors;
};

export const validatePost = (
  post: Partial<IPost>,
  postBlocks: IPostBlock[],
  setErrors: Dispatch<SetStateAction<Record<string, string>>>,
): boolean => {
  const result = validateSchema({
    title: post.title,
    shortDescription: post.shortDescription,
    status: post.status,
    tags: post.tags,
    postBlocks,
  });

  if (Object.keys(result).length > 0) {
    setErrors(result);
    return false;
  } else {
    setErrors({});
    return true;
  }
};
