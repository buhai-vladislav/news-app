import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

type MutationError = FetchBaseQueryError | SerializedError;

interface IMutation<T> {
  data?: T;
  error?: MutationError;
}

export type { IMutation, MutationError };
