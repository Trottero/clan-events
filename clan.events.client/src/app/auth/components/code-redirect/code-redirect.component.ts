import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../auth.service';
import {
  Observable,
  Subscription,
  filter,
  from,
  interval,
  map,
  switchMap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-code-redirect',
  templateUrl: './code-redirect.component.html',
  styleUrls: ['./code-redirect.component.scss'],
})
export class CodeRedirectComponent implements OnInit, OnDestroy {
  private readonly _subscription: Subscription = new Subscription();

  loadingDots$: Observable<string> = interval(1000).pipe(
    map(i => '.'.repeat((i % 4) + 1))
  );

  codeRedeemer$ = this.route.queryParamMap.pipe(
    map(params => params.get('code')),
    filter(x => !!x),
    switchMap(code => this.authService.redeemCode(code!))
  );

  navigateToHome$ = this.authService.hasValidToken$.pipe(
    filter(x => x),
    switchMap(() => from(this.router.navigate(['/profile'])))
  );

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
