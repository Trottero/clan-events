import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { sanitizeClanName } from '@common/clan';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { SnackbarService } from 'src/app/common/snackbar/snackbar-service';
import { AsyncClanNameValidator } from '../../validators/async-clan-name.validator';

@Component({
  selector: 'app-create-clan',
  templateUrl: './create-clan.component.html',
  styleUrls: ['./create-clan.component.scss'],
})
export class CreateClanComponent implements OnInit, OnDestroy {
  private readonly clanService = inject(ClanService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly asyncClanNameValidator = inject(AsyncClanNameValidator);

  name = new FormControl<string>(
    '',
    [Validators.required, Validators.minLength(3)],
    [this.asyncClanNameValidator.validate.bind(this.asyncClanNameValidator)]
  );

  formGroup = new FormGroup({
    name: this.name,
  });

  clanId$ = this.formGroup.value$.pipe(
    notNullOrUndefined(),
    map(value => sanitizeClanName(value.name))
  );

  private readonly createClanSubmit$ = new Subject<void>();
  private readonly createClan$ = this.createClanSubmit$.pipe(
    withLatestFrom(this.clanId$),
    switchMap(([_, clanId]) => this.clanService.createClan(clanId))
  );

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.createClan$.subscribe({
        next: result => {
          this.snackbarService.success('Clan created');
          this.router.navigate(['/clan', result.name]);
        },
        error: error => {
          console.log(error);
          this.snackbarService.error(error.error.message);
        },
      })
    );
  }

  createClan() {
    this.createClanSubmit$.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
