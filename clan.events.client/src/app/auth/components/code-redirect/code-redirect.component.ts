import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import {
  Subscription,
  filter,
  from,
  interval,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-code-redirect',
  templateUrl: './code-redirect.component.html',
  styleUrls: ['./code-redirect.component.scss'],
})
export class CodeRedirectComponent implements OnInit, OnDestroy {
  loadingDots$ = interval(1000).pipe(map((i) => '.'.repeat((i % 4) + 1)));

  codeRedeemer$ = this.route.queryParamMap.pipe(
    map((params) => params.get('code')),
    filter((x) => !!x),
    switchMap((code) => this.authService.redeemCode(code as string))
  );

  navigateToHome$ = this.authService.hasValidToken$.pipe(
    filter((x) => x),
    switchMap(() => from(this.router.navigate(['/profile'])))
  );

  private _subscription: Subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this._subscription.add(this.codeRedeemer$.subscribe());
    this._subscription.add(this.navigateToHome$.subscribe());
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
