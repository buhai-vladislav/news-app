import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

export type DnDMediaProps = {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  media: string | null;
  clearMedia: () => void;
  isDragActive: boolean;
  isLoading: boolean;
};
