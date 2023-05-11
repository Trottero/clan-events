import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Subject, Subscription, delay, switchMap, tap } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar-service';

@Component({
  selector: 'app-apply-to-clan',
  templateUrl: './apply-to-clan.component.html',
  styleUrls: ['./apply-to-clan.component.scss'],
})
export class ApplyToClanComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  private readonly snackbarService = inject(SnackbarService);

  clanName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  formGroup = new FormGroup({
    clanName: this.clanName,
  });

  private readonly applyToClanSubmit$ = new Subject<void>();
  private readonly applyToClan$ = this.applyToClanSubmit$.pipe(delay(1000));

  ngOnInit(): void {
    this.subscriptions.add(
      this.applyToClan$.subscribe({
        next: () => this.snackbarService.success('Application submitted'),
        error: error =>
          this.snackbarService.error('Failed to submit application'),
      })
    );
  }

  applyToClan() {
    this.applyToClanSubmit$.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
