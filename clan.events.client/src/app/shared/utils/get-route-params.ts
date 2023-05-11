import { ActivatedRouteSnapshot } from '@angular/router';

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

export function getQueryParamFromSnapshot<T = unknown>(
  route: ActivatedRouteSnapshot,
  paramsKey: string
): T | undefined {
  return route.queryParams[paramsKey];
}
