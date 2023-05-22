import { ActivatedRouteSnapshot } from '@angular/router';

/**
 * Recursively searches the given `ActivatedRouteSnapshot` and its children for a route parameter with the specified key.
 * If found, returns the value of the parameter. Otherwise, returns `undefined`.
 *
 * @param route The `ActivatedRouteSnapshot` to search.
 * @param paramsKey The key of the route parameter to find.
 * @returns The value of the route parameter with the specified key, or `undefined` if not found.
 */
export function getRouteParamsFromSnapshot<T = unknown>(
  route: ActivatedRouteSnapshot,
  paramsKey: string
): T | undefined {
  if (paramsKey in route.params) {
    return route.params[paramsKey];
  }

  return route.children.reduce<T | undefined>(
    (routeParams, childRoute) =>
      routeParams ?? getRouteParamsFromSnapshot(childRoute, paramsKey),
    undefined
  );
}

/**
 * Returns the value of the query parameter with the specified key from the given `ActivatedRouteSnapshot`.
 * If the parameter is not found, returns `undefined`.
 *
 * @param route The `ActivatedRouteSnapshot` to search.
 * @param paramsKey The key of the query parameter to find.
 * @returns The value of the query parameter with the specified key, or `undefined` if not found.
 */
export function getQueryParamFromSnapshot<T = unknown>(
  route: ActivatedRouteSnapshot,
  paramsKey: string
): T | undefined {
  return route.queryParams[paramsKey];
}
