import { UserModal } from './components/UserModal';
import { useCreateUser } from './hooks/useCreateUser';
import { UsersTable } from './components/UserTable';
import './Users.scss';

export const UsersPage = () => {
  const { formik, isOpen, onClose, onOpen, onOpenChange } = useCreateUser();

  return (
    <div className="users__wrapper">
      <UserModal
        formik={formik}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        title="Create User"
      />
      <div className="users__wrapper__table">
        <UsersTable onOpen={onOpen} />
      </div>
    </div>
  );
};
