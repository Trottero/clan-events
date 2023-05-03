import { MonoTypeOperatorFunction, map, pipe, tap } from 'rxjs';

let hydrationMap: { [key: string]: boolean } = {};

export function hydrate<T>(
  storageKey: string,
  initialState: T
): MonoTypeOperatorFunction<T> {
  return pipe(
    map((val) => {
      // If already hydrated, update storage and return
      if (hydrationMap[storageKey]) {
        // Store in local storage
        localStorage.setItem(storageKey, JSON.stringify(val));
        return val;
      }

      // Not hydrated, check if there's an item stored.
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        // If there's a stored value, return it
        // and mark the hydrated as true
        console.log('Hydrated from localstorage', val);
        hydrationMap[storageKey] = true;
        return { ...initialState, ...JSON.parse(stored) };
      }

      // Nothing stored, return the state that was passed, but mark it as hydrated
      localStorage.setItem(storageKey, JSON.stringify(val));
      hydrationMap[storageKey] = true;
      return { ...JSON.parse(JSON.stringify(val)) };
    })
  );
}
