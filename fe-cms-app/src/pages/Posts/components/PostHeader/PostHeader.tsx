import {
  Textarea,
  Input,
  Select,
  SelectItem,
  Selection,
} from '@nextui-org/react';
import { FC, Key } from 'react';
import { PostHeaderProps } from './PostHeader.props';
import { useDropzone } from 'react-dropzone';
import './PostHeader.scss';
import { PostStatus } from '../../../../shared/types';
import { DnDMedia } from '../../../../components/DnDMedia';

export const PostHeader: FC<PostHeaderProps> = ({
  errors,
  onPostChange,
  post,
  onDrop,
  media,
  clearMedia,
  onSelectChange,
  tags,
  isLoading,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <div className="post__header drop-shadow-xl">
      <div className="post__header__inputs">
        <div className="post__header__inputs__title">
          <Input
            name="title"
            onChange={onPostChange}
            value={post.title}
            label="Title"
            size="sm"
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            className="post__header__inputs__title_input"
            disabled={isLoading}
          />
          <Select
            selectedKeys={[post.status!]}
            size="lg"
            className="post__header__inputs__title_select"
            selectionMode="single"
            onSelectionChange={onSelectChange('status')}
            aria-label="Select post status"
            disabled={isLoading}
            isInvalid={!!errors.status}
            errorMessage={errors.status}
          >
            {Object.entries(PostStatus).map(([key, value]) => (
              <SelectItem
                key={key}
                value={value}
                className="capitalize"
                aria-label="Select post status"
              >
                {value.toLowerCase()}
              </SelectItem>
            ))}
          </Select>
          <Select
            selectedKeys={
              new Set(
                post?.tags?.map((tag) => tag.id as Key) ?? [],
              ) as Selection
            }
            size="lg"
            className="post__header__inputs__title_select"
            selectionMode="multiple"
            onSelectionChange={onSelectChange('tags')}
            aria-label="Select post status"
            isInvalid={!!errors.tags}
            errorMessage={errors.tags}
            disabled={isLoading}
          >
            {tags.map(({ id, name }) => (
              <SelectItem
                key={id}
                value={id}
                className="capitalize"
                aria-label="Select post status"
              >
                {name}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Textarea
          name="shortDescription"
          onChange={onPostChange}
          value={post.shortDescription}
          label="Short description"
          isInvalid={!!errors.shortDescription}
          errorMessage={errors.shortDescription}
          minRows={8}
          disabled={isLoading}
        />
      </div>
      <DnDMedia
        clearMedia={clearMedia}
        getRootProps={getRootProps}
        media={media}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isLoading={isLoading}
      />
    </div>
  );
};
