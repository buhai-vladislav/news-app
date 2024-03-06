import { MixinConcatType, MixinStatus, MixinType } from '@prisma/client';
import { SortOrder } from './SortOrder';

export interface MixinsFindOptions {
  page: number;
  limit: number;
  type?: MixinType;
  concatTypes?: MixinConcatType[];
  status?: MixinStatus;
  sortBy?: string;
  sortOrder?: SortOrder;
}
