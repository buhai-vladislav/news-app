import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  HttpStatus,
  IAffectedResult,
  IMutation,
  IResponse,
  ITag,
} from '../../../shared/types';
import {
  useCreateTagMutation,
  useDeleteTagsMutation,
  useGetTagsQuery,
} from '../../../store/api/tags.api';
import { TagsFormValues } from '../TagsPage.props';
import { toast } from 'react-toastify';
import { FormikHelpers, useFormik } from 'formik';
import { tagValidationSchema } from '../utils/validation';
import { useErrorToast } from '../../../shared/hooks';

export const useTagsPage = () => {
  const [tags, setTags] = useState<Array<Partial<ITag>>>([]);
  const [tagsToRemove, setTagsToRemove] = useState<Array<Partial<ITag>>>([]);

  const { data, isLoading } = useGetTagsQuery();
  const [createTags, { error: createTagsError }] = useCreateTagMutation();
  const [deleteTags, { error: deleteTagsError }] = useDeleteTagsMutation();

  useEffect(() => {
    if (data?.data) {
      setTags(data.data);
    }
  }, [data]);

  const onSubmit = useCallback(
    (values: TagsFormValues, helpers?: FormikHelpers<TagsFormValues>) => {
      setTags((prev) => [...prev, { name: values.name }]);
      helpers?.resetForm();
    },
    [],
  );

  const moveToDeleteTags = useCallback(
    (tag: Partial<ITag>) => () => {
      setTags(tags.filter((item) => item.name !== tag.name));
      setTagsToRemove([...tagsToRemove, tag]);
    },
    [tags, tagsToRemove],
  );

  const moveToCreateTags = useCallback(
    (tag: Partial<ITag>) => () => {
      setTagsToRemove(tagsToRemove.filter((item) => item.name !== tag.name));
      setTags([...tags, tag]);
    },
    [tagsToRemove, tags],
  );

  const createTagsHandler = useCallback(async () => {
    if (tags.length > 0) {
      const tagsToCreate = tags
        .filter((tag) => tag.id === undefined)
        .filter(Boolean)
        .map((tag) => tag.name) as unknown as string[];

      if (tagsToCreate.length > 0) {
        const response: IMutation<IResponse<Array<ITag>>> = await createTags({
          tags: tagsToCreate,
        });

        if (response?.data) {
          toast.success('Tags created successfully', {
            position: 'bottom-center',
          });
        }
      }
    }
  }, [tags]);

  const deleteTagsHandler = useCallback(async () => {
    if (tagsToRemove.length > 0) {
      const tagsToDelete = tagsToRemove
        .filter((tag) => tag.id !== undefined)
        .filter(Boolean)
        .map((tag) => tag.id) as unknown as string[];

      if (tagsToDelete.length > 0) {
        const response: IMutation<IResponse<IAffectedResult>> =
          await deleteTags({
            ids: tagsToDelete.join(','),
          });

        if (response?.data) {
          toast.success('Tags deleted successfully', {
            position: 'bottom-center',
          });
        }
      }
    }
  }, [tagsToRemove]);

  const onSave = useCallback(async () => {
    await Promise.all([createTagsHandler(), deleteTagsHandler()]);

    setTagsToRemove([]);
  }, [createTagsHandler, deleteTagsHandler]);

  const formik = useFormik<TagsFormValues>({
    initialValues: {
      name: '',
    },
    onSubmit,
    validateOnChange: false,
    validationSchema: tagValidationSchema,
  });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      if (tags.some((tag) => tag.name?.toLowerCase() === value.toLowerCase())) {
        formik.setFieldError(name, 'Tag already exists');
        return;
      }
      formik.setFieldValue(name, value);
    },
    [tags],
  );

  const onEnterPress = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      formik.submitForm();
    }
  }, []);

  useErrorToast(createTagsError || deleteTagsError, [
    { status: HttpStatus.BAD_REQUEST, errorMessage: 'Failed to save tags' },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: 'Failed to save tags',
    },
  ]);

  return {
    tags,
    tagsToRemove,
    isLoading,
    formik,
    onEnterPress,
    handleChange,
    moveToCreateTags,
    moveToDeleteTags,
    onSave,
  };
};
