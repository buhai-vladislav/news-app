import { Dispatch, MutableRefObject, ReactNode, SetStateAction } from 'react';
import AvatarEditor from 'react-avatar-editor';

type ImageEditorProps = {
  image: File | string;
  setImage: Dispatch<SetStateAction<File | string>>;
  width?: number;
  height?: number;
  imageRef: MutableRefObject<AvatarEditor | null>;
  buttons?: ReactNode;
  borderRadius?: number;
  disabled?: boolean;
};

export type { ImageEditorProps };
