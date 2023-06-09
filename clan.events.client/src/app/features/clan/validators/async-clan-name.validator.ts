import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, delay, finalize, first, map, of, switchMap } from 'rxjs';
import { sanitizeClanName } from '@common/clan';
import { ClanApiService } from '../services/clan.api.service';

@Injectable()
export class AsyncClanNameValidator implements AsyncValidator {
  clanApiService = inject(ClanApiService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      delay(1000),
      switchMap(value =>
        this.clanApiService.clanExists(sanitizeClanName(value))
      ),
      map(exists => (exists ? { clanExists: true } : null)),
      first(),
      finalize(() => control.root.updateValueAndValidity({ onlySelf: true }))
    );
  }
}
