import {
  Observable,
  ObservableInput,
  OperatorFunction,
  catchError,
  concat,
  map,
  of,
  share,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

export enum LoadableState {
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export interface Loading {
  state: LoadableState.Loading;
}

export interface Success<T> {
  state: LoadableState.Success;
  value: T;
}

export interface Error {
  state: LoadableState.Error;
  message: string;
}

export type Loadable<T> = Readonly<Loading | Success<T> | Error>;

export function loading(): Loading {
  return { state: LoadableState.Loading };
}

export function success<T>(value: T): Success<T> {
  return { state: LoadableState.Success, value };
}

export function error(message: string): Error {
  return { state: LoadableState.Error, message };
}

export function isLoading<T>(loadable: Loadable<T>): loadable is Loading {
  return loadable.state === LoadableState.Loading;
}

export function isSuccess<T>(loadable: Loadable<T>): loadable is Success<T> {
  return loadable.state === LoadableState.Success;
}

export function isError<T>(loadable: Loadable<T>): loadable is Error {
  return loadable.state === LoadableState.Error;
}

export function mapToLoadable<T>(): OperatorFunction<T, Loadable<T>> {
  return (source$: Observable<T>) => {
    return concat(
      of(loading()),
      source$.pipe(
        map(value => success(value)),
        catchError((e: Error) => of(error(e.message)))
      )
    ).pipe(tap(x => console.log(x)));
  };
}
