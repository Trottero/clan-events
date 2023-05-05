import { MonoTypeOperatorFunction, map, pipe } from 'rxjs';

const HYDRATION_MAP: { [key: string]: boolean } = {};

export function hydrate<T>(
  storageKey: string,
  initialState: T,
): MonoTypeOperatorFunction<T> {
  return pipe(
    map((val) => {
      // If already hydrated, update storage and return
      if (HYDRATION_MAP[storageKey]) {
        // Store in local storage
        localStorage.setItem(storageKey, JSON.stringify(val));

        return val;
      }

      // Not hydrated, check if there's an item stored.
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        // If there's a stored value, return it
        // and mark the hydrated as true
        HYDRATION_MAP[storageKey] = true;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { ...initialState, ...JSON.parse(stored) };
      }

      // Nothing stored, return the state that was passed, but mark it as hydrated
      localStorage.setItem(storageKey, JSON.stringify(val));
      HYDRATION_MAP[storageKey] = true;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return { ...JSON.parse(JSON.stringify(val)) };
    }),
  );
}
