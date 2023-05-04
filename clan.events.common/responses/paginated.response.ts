import { PaginationModel } from './pagination.model';
import { Response } from './response';

export type PaginatedModel<T> = { items: T[] } & PaginationModel;

export type PaginatedResponse<T> = Response<{ items: T[] } & PaginationModel>;
