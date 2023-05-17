import { Pipe, PipeTransform } from '@angular/core';
import { Loadable, isLoading, loading } from '../operators/loadable';

@Pipe({
  name: 'isLoading',
  standalone: true,
})
export class IsLoadingPipe<T> implements PipeTransform {
  transform(value: undefined | null | Loadable<T>): boolean {
    return isLoading(value ?? loading());
  }
}
