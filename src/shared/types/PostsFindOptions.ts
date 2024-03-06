import { MixinConcatType, PostStatus } from '@prisma/client';
import { SortOrder } from './SortOrder';

export class PostsFindOptions {
  search?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: PostStatus;
  creatorId?: string;
  page: number;
  limit: number;
  mixinConcatType?: MixinConcatType;
}
