import { IEntity } from './Entity';

interface IMedia extends IEntity {
  name: string;
  encoding: string;
  mimetype: string;
  size: number;
  fileSrc: string;
}

export type { IMedia };
