import { IEntity, IMedia, ITag, IUser, SortOrder } from './';

export enum PostStatus {
  HIDDEN = 'HIDDEN',
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
export enum FieldType {
  RICH_TEXT = 'RICH_TEXT',
  MEDIA = 'MEDIA',
}

export enum PostBlockActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface IPostBlock extends IEntity {
  order: number;
  type: FieldType;
  content?: string;
  media: IMedia | string | null;
  actionType?: PostBlockActionType;
  fileName?: string;
}

export interface IPost extends IEntity {
  externalId?: string;
  title: string;
  shortDescription: string;
  creatorId?: string;
  creator?: IUser;
  creatorName?: string;
  status: PostStatus;
  postBlocks?: IPostBlock[];
  tags?: Partial<ITag>[];
  media: IMedia | string | null;
  mediaName?: string;
  type: 'new' | 'created';
  deletedAt: Date | null;
}

export interface ICreatePostBlock {
  type: FieldType;
  content?: string;
  fileName?: string;
  order: number;
}

export interface ICreatePost {
  title: string;
  shortDescription: string;
  creatorId: string;
  status: PostStatus;
  postBlocks: ICreatePostBlock[];
  tags: string[];
  mediaName: string | null;
}

export interface IUpdatePostData {
  id: string;
  body: FormData;
}

export interface IGetPostsParams {
  search?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  status?: PostStatus;
  creatorId?: string;
  page: number;
  limit: number;
}
