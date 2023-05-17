import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, Subscription, map, switchMap, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { sanitizeClanName } from '@common/clan';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { AsyncClanNameValidator } from '../../validators/async-clan-name.validator';
import { ClanApiService } from '../../services/clan.api.service';
import { ClansService } from '../../services/clans.service';
import { SelectedClanService } from '../../services/selected-clan.service';
import { SnackbarService } from 'src/app/core/components/snackbar/snackbar.service';

@Component({
  selector: 'app-create-clan',
  templateUrl: './create-clan.component.html',
  styleUrls: ['./create-clan.component.scss'],
})
export class CreateClanComponent implements OnInit, OnDestroy {
  private readonly clanApiService = inject(ClanApiService);
  private readonly clansService = inject(ClansService);
  private readonly selectedClanService = inject(SelectedClanService);
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
    withLatestFrom(this.formGroup.value$),
    switchMap(([_, formGroup]) =>
      this.clanApiService.createClan(formGroup.name)
    )
  );

  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.createClan$.subscribe({
        next: result => {
          this.snackbarService.success('Clan created');
          this.clansService.refreshClans();
          this.selectedClanService.setSelectedClan(result.name);
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
