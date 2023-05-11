import { Pipe, PipeTransform } from '@angular/core';
import { Loadable, isSuccess, Success, loading } from '../operators/loadable';

@Pipe({
  name: 'isSuccess',
  standalone: true,
})
export class IsSuccessPipe<T> implements PipeTransform {
  transform(value: undefined | null | Loadable<T>): T | undefined {
    return isSuccess(value ?? loading())
      ? (value as Success<T>).value
      : undefined;
  }
}
