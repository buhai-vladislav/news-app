interface IResponse<T> {
  message: string;
  status: number;
  data?: T;
  error?: string | object;
}

interface IPaginationMeta {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface IPaginated<T> {
  items: T[];
  pagination: IPaginationMeta;
}

interface IAffectedResult {
  isAffected: boolean;
}

export type { IResponse, IPaginated, IPaginationMeta, IAffectedResult };
