import { PaginationModel } from './pagination.model';
import { Response } from './response';

export type PaginatedResponse<T> = Response<{ items: T[] } & PaginationModel>;
