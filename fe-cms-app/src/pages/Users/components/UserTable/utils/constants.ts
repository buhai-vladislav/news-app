export type Color =
  | 'default'
  | 'success'
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'warning'
  | undefined;

export const STATUS_COLOR: Record<string, Color> = {
  active: 'success',
  paused: 'danger',
};

export const USERS_COLUMNS = [
  { name: 'ID', uid: 'id' },
  { name: 'NAME', uid: 'fullname', sortable: true },
  { name: 'ROLE', uid: 'role' },
  { name: 'STATUS', uid: 'status' },
  { name: 'POSTS', uid: 'posts' },
  { name: 'ACTIONS', uid: 'actions' },
];

export const STATUS_OPTIONS = [
  { name: 'Active', uid: 'true' },
  { name: 'Paused', uid: 'false' },
  { name: 'All', uid: 'all' },
];

export const PER_PAGE_OPTIONS = [
  { name: '10', uid: 10 },
  { name: '20', uid: 20 },
  { name: '30', uid: 30 },
];
