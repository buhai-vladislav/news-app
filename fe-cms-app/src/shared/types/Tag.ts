import { IEntity } from '.';

export interface ITag extends IEntity {
  name: string;
}

export interface ICreateTags {
  tags: string[];
}

export interface IDeleteTags {
  ids: string;
}
