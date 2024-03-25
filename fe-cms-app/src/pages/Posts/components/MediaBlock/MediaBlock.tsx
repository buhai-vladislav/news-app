import { FC, useCallback } from 'react';
import { DnDMedia } from '../../../../components/DnDMedia';
import { useDropzone } from 'react-dropzone';
import { MediaBlockProps } from './MediaBlock.props';
import { Button } from '@nextui-org/react';
import { TrashIcon } from '../../../../assets/icons';
import './MediaBlock.scss';

export const MediaBlock: FC<MediaBlockProps> = ({
  media,
  clearMedia,
  handleMediaChange,
  id,
  isLoading,
  onDeleteBlock,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleMediaChange(id, acceptedFiles[0]);
    },
    [id],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <div className="media-block__wrapper">
      <DnDMedia
        isLoading={isLoading}
        clearMedia={clearMedia}
        getInputProps={getInputProps}
        getRootProps={getRootProps}
        media={typeof media === 'string' ? media : media?.fileSrc ?? ''}
        isDragActive={isDragActive}
      />
      <Button
        color="danger"
        onPress={onDeleteBlock}
        isIconOnly
        className="drop-shadow-lg"
      >
        <TrashIcon />
      </Button>
    </div>
  );
};
