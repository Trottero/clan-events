import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../auth.service';
import {
  Subscription,
  filter,
  from,
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

  codeRedeemer$ = this.route.queryParamMap.pipe(
    map((params) => params.get('code')),
    filter((x) => !!x),
    switchMap((code) => this.authService.redeemCode(code as string))
  );

  navigateToHome$ = this.authService.hasValidToken$.pipe(
    filter((x) => x),
    switchMap(() => from(this.router.navigate(['/profile'])))
  );

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this._subscription.add(this.codeRedeemer$.subscribe());
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
