import { FieldType } from '@prisma/client';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  HttpStatus,
  IMutation,
  IPost,
  IPostBlock,
  IResponse,
  ITag,
  PostBlockActionType,
  PostStatus,
} from '../../../shared/types';
import { Selection } from '@nextui-org/react';
import { renameFile } from '../../../shared/utils/renameFile';
import {
  useCreatePostMutation,
  useLazyGetPostByIdQuery,
  useUpdatePostMutation,
} from '../../../store/api/post.api';
import { createFormData } from '../../../shared/utils/createFormData';
import { useErrorToast } from '../../../shared/hooks';
import { toast } from 'react-toastify';
import { useGetTagsQuery } from '../../../store/api/tags.api';
import { validatePost } from '../utils/validation';
import { useNavigate, useParams } from 'react-router-dom';
import { useDnD } from '../../../shared/hooks/useDnD';

export const usePostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [post, setPost] = useState<Partial<IPost>>({
    shortDescription: '',
    title: '',
    status: PostStatus.DRAFT,
    media: null,
    tags: [],
    type: 'new',
  });
  const [postBlocks, setPostBlocks] = useState<IPostBlock[]>([]);

  const [createPost, { isLoading: createPostLoading, error: createPostError }] =
    useCreatePostMutation();
  const [updatePost, { isLoading: updatePostLoading, error: updatePostError }] =
    useUpdatePostMutation();

  const { data: tags } = useGetTagsQuery();
  const [getPostById, { isLoading: getPostByIdLoading, data: postById }] =
    useLazyGetPostByIdQuery();

  const onDeleteBlock = useCallback(
    (blockId: string) => () => {
      setPostBlocks((prev) => {
        const blocks =
          post.type !== 'new'
            ? [...prev]
            : [...prev.filter((item) => item.id !== blockId)];

        return blocks.map((item, index) => ({
          ...item,
          order: index + 1,
          actionType:
            post.type === 'new'
              ? undefined
              : item.id === blockId
                ? PostBlockActionType.DELETE
                : item.actionType,
        }));
      });
    },
    [post],
  );

  const onAddBlock = useCallback(
    (type: FieldType, order: number) => () => {
      const rawBlock = {
        id: uuid(),
        type,
        content: '',
        order,
        actionType:
          post.type === 'new' ? undefined : PostBlockActionType.CREATE,
      } as IPostBlock;

      setPostBlocks((prev) => [...prev, rawBlock]);
    },
    [post],
  );

  const onPostChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onSelectChange = useCallback(
    (name: string) => (keys: Selection) => {
      if (name === 'status') {
        setPost((prev) => ({ ...prev, [name]: Object.values(keys)[0] }));
      }
      if (name === 'tags') {
        setPost((prev) => ({
          ...prev,
          tags: Array.from(keys).map((id) => ({ id }) as ITag),
        }));
      }
    },
    [],
  );

  const onDrop = useCallback((files: File[]) => {
    const file = renameFile(files[0], `${uuid()}@@${files[0].name}`);
    const base64 = window.URL.createObjectURL(file);

    setFiles((prev) => [...prev, file]);
    setPost((prev) => ({ ...prev, media: base64, mediaName: file.name }));
  }, []);

  const clearMainMedia = useCallback(() => {
    setFiles((prev) => prev.filter((item) => item.name !== post?.mediaName));
    setPost((prev) => ({ ...prev, media: null }));
  }, [post]);

  const clearBlockMedia = useCallback(
    (id: string) => () => {
      const block = postBlocks.find((item) => item.id === id);

      if (!block) return;

      setFiles((prev) => prev.filter((item) => item.name !== block.fileName));
      setPostBlocks((prev) =>
        prev.map((postBlock) =>
          postBlock.id === id ? { ...postBlock, media: null } : postBlock,
        ),
      );
    },
    [postBlocks],
  );

  const handleBlockMediaChange = useCallback(
    (id: string, file: File) => {
      const renamedFile = renameFile(file, `${uuid()}@@${file.name}`);
      const base64 = window.URL.createObjectURL(renamedFile);

      setPostBlocks((prev) =>
        prev.map((postBlock) =>
          postBlock.id === id
            ? {
                ...postBlock,
                media: base64,
                fileName: renamedFile.name,
                actionType:
                  post.type === 'new'
                    ? undefined
                    : postBlock.actionType ?? PostBlockActionType.UPDATE,
              }
            : postBlock,
        ),
      );
      setFiles((prev) => [...prev, renamedFile]);
    },
    [post],
  );

  const handleBlockContentChange = useCallback(
    (id: string) => (content: string) => {
      setPostBlocks((prev) =>
        prev.map((postBlock) =>
          postBlock.id === id
            ? {
                ...postBlock,
                content,
                actionType:
                  post.type === 'new' ? undefined : PostBlockActionType.UPDATE,
              }
            : postBlock,
        ),
      );
    },
    [post],
  );

  const onSubmitHandler = useCallback(async () => {
    const { media, tags, type, ...rest } = post;

    if (!validatePost(post, postBlocks, setErrors)) return;

    const formData = createFormData({
      ...rest,
      postBlocks: postBlocks.map((item) => ({
        content: item.content ?? undefined,
        type: item.type,
        order: item.order,
        fileName: item.fileName ?? undefined,
        actionType: item.actionType,
        id:
          item.actionType && item.actionType !== PostBlockActionType.CREATE
            ? item.id
            : undefined,
      })),
    });

    files.forEach((file) => {
      formData.append('files', file);
    });

    if (post.tags) {
      formData.append('tags', post.tags.map((tag) => tag.id).join(','));
    }

    if (type === 'new') {
      const response: IMutation<IResponse<IPost>> = await createPost(formData);

      if (response?.data) {
        toast.success('Post created successfully', {
          position: 'bottom-center',
        });
        navigate(`/posts/${response?.data?.data?.id}`);
      }
    } else {
      const response: IMutation<IResponse<IPost>> = await updatePost({
        id: postId!,
        body: formData,
      });

      if (response?.data) {
        toast.success('Post updated successfully', {
          position: 'bottom-center',
        });
      }
    }
  }, [post, postBlocks, files, postId]);

  useErrorToast(createPostError || updatePostError, [
    { status: HttpStatus.BAD_REQUEST, errorMessage: 'Something went wrong' },
    { status: HttpStatus.NOT_FOUND, errorMessage: 'Something went wrong' },
    { status: HttpStatus.UNAUTHORIZED, errorMessage: 'You are unauthorized' },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: 'Something went wrong',
    },
  ]);

  useEffect(() => {
    if (errors?.postBlocks) {
      toast.error(errors?.postBlocks, {
        position: 'bottom-center',
        autoClose: 5000,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (postId) {
      getPostById(postId);
    } else {
      setPost({
        shortDescription: '',
        title: '',
        status: PostStatus.DRAFT,
        media: null,
        tags: [],
        type: 'new',
      });
      setPostBlocks([]);
    }
  }, [postId]);

  useEffect(() => {
    if (postById?.data) {
      const {
        title,
        shortDescription,
        status,
        tags,
        postBlocks,
        media,
        deletedAt,
      } = postById.data;

      setPost({
        title,
        shortDescription,
        status,
        tags,
        media: typeof media !== 'string' ? media?.fileSrc : media,
        type: 'created',
        deletedAt,
      });

      if (postBlocks) {
        const newPostBlocks = postBlocks
          .slice()
          .sort((a, b) => a.order - b.order);
        setPostBlocks(newPostBlocks);
      }
    }
  }, [postById]);

  const { onDragEnd } = useDnD(postBlocks, setPostBlocks, (item, index) => ({
    ...item,
    order: index + 1,
    actionType: PostBlockActionType.UPDATE,
  }));

  const isLoading = useMemo(
    () => createPostLoading || getPostByIdLoading || updatePostLoading,
    [createPostLoading, getPostByIdLoading, updatePostLoading],
  );

  return {
    post,
    errors,
    tags: tags?.data,
    postBlocks,
    isLoading,
    onSelectChange,
    onPostChange,
    onAddBlock,
    onDeleteBlock,
    clearMainMedia,
    onDrop,
    clearBlockMedia,
    handleBlockMediaChange,
    onDragEnd,
    onSubmitHandler,
    handleBlockContentChange,
  };
};
