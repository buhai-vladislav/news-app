import { FC, Key, useCallback, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Spinner,
} from '@nextui-org/react';

import { capitalize } from './utils/capitalize';
import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from '../../../../assets/icons';
import { IUser } from '../../../../shared/types';
import {
  USERS_COLUMNS,
  STATUS_COLOR,
  STATUS_OPTIONS,
  PER_PAGE_OPTIONS,
} from './utils/constants';
import { useUserTable } from './hooks/useUserTable';
import { UserTableProps } from './UserTable.props';
import { useDeleteUser } from '../../hooks/useDeleteUser';
import { useUpdateUser } from '../../hooks/useUpdateUser';
import { UserModal } from '../UserModal';

export const UsersTable: FC<UserTableProps> = ({ onOpen }) => {
  const {
    page,
    search,
    isLoading,
    usersData,
    statusFilter,
    sortDescriptor,
    hasSearchFilter,
    setPage,
    onClear,
    onSearchChange,
    setSortDescriptor,
    onRowsPerPageChange,
    onStatusFilterChange,
  } = useUserTable();

  const {
    error: deleteUserError,
    onDelete,
    isLoading: isDeleting,
  } = useDeleteUser();
  const {
    error: updateUserError,
    formik,
    handleSelectUser,
    isOpen,
    onClose,
    onOpenChange,
    onBanUser,
  } = useUpdateUser();

  const renderCell = useCallback((user: Partial<IUser>, columnKey: Key) => {
    const cellValue = user[columnKey as keyof IUser];

    switch (columnKey) {
      case 'fullname':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src:
                typeof user.avatar === 'string'
                  ? user.avatar
                  : user?.avatar?.fileSrc,
            }}
            description={user.email}
            name={cellValue as string}
          >
            {user.email}
          </User>
        );
      case 'role':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {cellValue as string}
            </p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.role}
            </p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={STATUS_COLOR[user.deletedAt !== null ? 'paused' : 'active']}
            size="sm"
            variant="flat"
          >
            {capitalize(user.deletedAt ? 'paused' : 'active')}
          </Chip>
        );
      case 'actions':
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown isDisabled={user.role !== 'USER'}>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  disabled={user.role !== 'USER'}
                >
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onPress={handleSelectUser(user as IUser)}>
                  Edit
                </DropdownItem>
                <DropdownItem onPress={onDelete(user.id!)}>Delete</DropdownItem>
                <DropdownItem onPress={onBanUser(user)}>
                  {user.deletedAt === null ? 'Ban User' : 'Unban User'}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return <>{cellValue}</>;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={search}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect
                selectedKeys={statusFilter}
                selectionMode="single"
                onSelectionChange={onStatusFilterChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {usersData.users?.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option.uid} value={option.uid}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    search,
    statusFilter,
    onRowsPerPageChange,
    usersData.users,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={usersData.pagination?.totalPages || 0}
          onChange={setPage}
        />
      </div>
    );
  }, [page, hasSearchFilter, usersData.pagination]);

  return usersData.users ? (
    <>
      <Table
        aria-label="User Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[682px]',
        }}
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={USERS_COLUMNS}>
          {({ uid, name, sortable }) => (
            <TableColumn
              key={uid}
              align={uid === 'actions' ? 'center' : 'start'}
              allowsSorting={sortable}
            >
              {name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner />}
          loadingState={isLoading || isDeleting ? 'loading' : 'idle'}
          emptyContent="No users found"
          items={usersData.users as unknown as Array<Partial<IUser>>}
        >
          {(item: Partial<IUser>) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UserModal
        formik={formik}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        title="Update User"
      />
    </>
  ) : null;
};
