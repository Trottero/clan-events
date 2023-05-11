import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { ClanService } from '../services/clan.service';
import { Observable, delay, finalize, first, map, of, switchMap } from 'rxjs';
import { sanitizeClanName } from '@common/clan';

@Injectable()
export class AsyncClanNameValidator implements AsyncValidator {
  clanService = inject(ClanService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      delay(1000),
      switchMap(value => this.clanService.clanExists(sanitizeClanName(value))),
      map(exists => (exists ? { clanExists: true } : null)),
      first(),
      finalize(() => control.root.updateValueAndValidity({ onlySelf: true }))
    );
  }
}
