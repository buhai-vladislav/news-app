import { ChangeEvent } from 'react';
import { IPost, ITag } from '../../../../shared/types';
import { DropEvent, FileRejection } from 'react-dropzone';
import { Selection } from '@nextui-org/react';

export type PostHeaderProps = {
  post: Partial<IPost>;
  errors: { [key: string]: string };
  onPostChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (
    files: File[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  media: string | null;
  clearMedia: () => void;
  onSelectChange: (name: string) => (keys: Selection) => void;
  tags: ITag[];
  isLoading: boolean;
};
