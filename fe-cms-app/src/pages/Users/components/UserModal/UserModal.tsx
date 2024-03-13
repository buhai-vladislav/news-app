import { FC, useMemo } from 'react';
import { UserModalProps } from './UserModal.props';
import { ModalWrapper } from '../../../../components/ModalWrapper';
import { Button } from '@nextui-org/react';
import { UserForm } from './components/UserForm';

export const UserModal: FC<UserModalProps> = ({
  formik,
  isOpen,
  onOpenChange,
  title,
  onClose,
}) => {
  const modalFooter = useMemo(
    () => () => (
      <>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button color="primary" type="submit" onPress={formik.submitForm}>
          Submit
        </Button>
      </>
    ),
    [formik.submitForm, onClose],
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      modalBody={<UserForm formik={formik} />}
      modalFooter={modalFooter()}
    />
  );
};
