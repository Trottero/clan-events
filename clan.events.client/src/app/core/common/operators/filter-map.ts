// https://github.com/dscheerens/rxjs-xl/blob/master/src/lib/operators/filter-map.ts

import { OperatorFunction, Observable } from 'rxjs';

/** Special value used to indicate that the value should be filtered out (ignored/skipped). */
export const FILTERED = Symbol('FILTERED');
export type FILTERED = typeof FILTERED;

/**
 * Operator that combines the functionality of the `map` and `filter` operators into one single operator. There are certain scenarios in
 * which the combined operation of filtering and mapping is more convenient (more efficient and less verbose) than a `map` operator followed
 * by a `filter` operator.
 *
 * @param f A transformation function that maps every emitted value from the source observable to another value. If the function returns the
 *          special `FILTERED` value, then this value will be "filtered out" and it won't be emitted by the output observable.
 */
export function filterMap<T, U>(
  f: (value: T) => U | FILTERED
): OperatorFunction<T, U> {
  return (source$: Observable<T>) =>
    new Observable<U>(observer =>
      source$.subscribe(
        value => {
          const result = f(value);

          if (result !== FILTERED) {
            observer.next(result);
          }
        },
        error => observer.error(error),
        () => observer.complete()
      )
    );
}
