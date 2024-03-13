import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { FC } from 'react';
import { ModalWrapperProps } from './ModalWrapper.props';

export const ModalWrapper: FC<ModalWrapperProps> = ({
  isOpen,
  onOpenChange,
  modalBody,
  modalFooter,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>{modalBody}</ModalBody>
          <ModalFooter>{modalFooter}</ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
