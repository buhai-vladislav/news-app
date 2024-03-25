import { FC } from 'react';
import './DnDMedia.scss';
import { DnDMediaProps } from './DnDMedia.props';
import { Badge, Image } from '@nextui-org/react';
import { PlusIcon } from '../../assets/icons';

export const DnDMedia: FC<DnDMediaProps> = ({
  clearMedia,
  getInputProps,
  getRootProps,
  media,
  isDragActive,
  isLoading,
}) => {
  return media ? (
    <Badge
      className="dnd__badge"
      placement="top-right"
      onClick={isLoading ? () => {} : clearMedia}
      isOneChar
      size="lg"
      color="danger"
      content={<PlusIcon size={24} />}
    >
      <Image
        src={media}
        aria-label="Main media"
        className="dnd__badge__image"
      />
    </Badge>
  ) : (
    <div className="dnd__drop" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="dnd__drop__block">Drop the files here ...</div>
      ) : (
        <div className="dnd__drop__block">
          Drag 'n' drop some files here, or click to select files
        </div>
      )}
    </div>
  );
};
