export type ModalWrapperProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  modalBody: JSX.Element;
  modalFooter?: JSX.Element;
  title: string;
};
