import { Pipe, PipeTransform } from '@angular/core';
import { Loadable, loading, isError, Error } from '../operators/loadable';

@Pipe({
  name: 'isError',
  standalone: true,
})
export class IsErrorPipe<T> implements PipeTransform {
  transform(value: undefined | null | Loadable<T>): string | undefined {
    return isError(value ?? loading()) ? (value as Error).message : undefined;
  }
}
