import {
  UnaryFunction,
  Observable,
  pipe,
  filter,
  OperatorFunction,
} from 'rxjs';

export function notNullOrUndefined<T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> {
  return pipe(
    filter((x) => x !== null && x !== undefined) as OperatorFunction<
      T | null | undefined,
      T
    >
  );
}
