import { Selection, SortDescriptor } from '@nextui-org/react';
import React, { useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { cleanQueryParams } from '../../../../../shared/utils/normilizeQueryParams';
import { useGetAllUsersQuery } from '../../../../../store/api/user.api';

export const useUserTable = () => {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Selection>(
    new Set(['all']),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [page, setPage] = React.useState(1);
  const [debouncedValue] = useDebounce(search, 400);

  const { data, isLoading } = useGetAllUsersQuery({
    limit: rowsPerPage,
    page,
    ...cleanQueryParams({
      search: debouncedValue,
      sortBy: 'fullname',
      sortOrder: sortDescriptor.direction === 'ascending' ? 'asc' : 'desc',
      deletedAt: Array.from(statusFilter).join(','),
    }),
  });

  const hasSearchFilter = Boolean(debouncedValue);

  const usersData = useMemo(() => {
    const users = data?.data?.items.map((item) => ({
      id: item.id,
      fullname: item.fullname,
      role: item.role,
      email: item.email,
      status: item?.deletedAt ? 'paused' : 'active',
      posts: item.posts?.length || 0,
      deletedAt: item.deletedAt,
    }));

    const pagination = data?.data?.pagination;

    return {
      users,
      pagination,
    };
  }, [data]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setSearch(value);
      setPage(1);
    } else {
      setSearch('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setSearch('');
    setPage(1);
  }, []);

  const onStatusFilterChange = React.useCallback(
    (key: Selection) => {
      setStatusFilter(key);
      setPage(1);
    },
    [setStatusFilter],
  );

  return {
    usersData,
    page,
    search,
    statusFilter,
    hasSearchFilter,
    isLoading,
    sortDescriptor,
    setPage,
    onClear,
    setSortDescriptor,
    onSearchChange,
    onStatusFilterChange,
    onRowsPerPageChange,
  };
};
