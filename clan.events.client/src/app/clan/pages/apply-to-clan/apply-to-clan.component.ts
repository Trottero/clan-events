import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  Subject,
  Subscription,
  catchError,
  delay,
  of,
  share,
  switchMap,
  tap,
} from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar-service';
import { ClanApplicationApiService } from '../../services/clan-application.api.service';

@Component({
  selector: 'app-apply-to-clan',
  templateUrl: './apply-to-clan.component.html',
  styleUrls: ['./apply-to-clan.component.scss'],
})
export class ApplyToClanComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  private readonly snackbarService = inject(SnackbarService);
  private readonly clanApplicationApiService = inject(
    ClanApplicationApiService
  );

  clanName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  formGroup = new FormGroup({
    clanName: this.clanName,
  });

  private readonly applyToClanSubmit$ = new Subject<void>();
  private readonly applyToClan$ = this.applyToClanSubmit$.pipe(
    switchMap(() =>
      this.clanApplicationApiService.applyToClan(this.clanName.value).pipe(
        tap(() => this.snackbarService.success('Application submitted')),
        catchError(error => {
          this.snackbarService.error(
            `Failed to submit application: ${error.error.message}`
          );
          return of(null);
        })
      )
    ),
    share()
  );

  ngOnInit(): void {
    this.subscriptions.add(this.applyToClan$.subscribe());
  }

  applyToClan() {
    this.applyToClanSubmit$.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
