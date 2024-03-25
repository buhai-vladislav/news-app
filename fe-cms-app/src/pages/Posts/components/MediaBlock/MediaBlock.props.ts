import { IMedia } from '../../../../shared/types';

export type MediaBlockProps = {
  id: string;
  media: string | IMedia | null;
  clearMedia: () => void;
  handleMediaChange: (id: string, file: File) => void;
  isLoading: boolean;
  onDeleteBlock: () => void;
};
