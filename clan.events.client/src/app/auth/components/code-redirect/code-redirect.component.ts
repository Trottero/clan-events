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
import { Response } from 'clan.events.common/responses';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-code-redirect',
  templateUrl: './code-redirect.component.html',
  styleUrls: ['./code-redirect.component.scss'],
})
export class CodeRedirectComponent implements OnInit, OnDestroy {
  public loadingDots$: Observable<string> = interval(1000).pipe(
    map((i) => '.'.repeat((i % 4) + 1)),
  );

  public codeRedeemer$: Observable<Response<{ token: string }>> =
    this.route.queryParamMap.pipe(
      map((params) => params.get('code')),
      filter((x) => !!x),
      switchMap((code) => this.authService.redeemCode(code!)),
    );

  public navigateToHome$: Observable<boolean> =
    this.authService.hasValidToken$.pipe(
      filter((x) => x),
      switchMap(() => from(this.router.navigate(['/profile']))),
    );

  private readonly _subscription: Subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this._subscription.add(this.codeRedeemer$.subscribe());
    this._subscription.add(this.navigateToHome$.subscribe());
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
