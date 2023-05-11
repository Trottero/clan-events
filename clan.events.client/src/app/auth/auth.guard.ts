import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);

  return authService.hasValidToken$.pipe(
    map(hasValidToken => {
      if (!hasValidToken) {
        return createUrlTreeFromSnapshot(next, ['/']);
      }

      return true;
    })
  );
};
