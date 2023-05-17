import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter, from, map, shareReplay, switchMap } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrls: ['./auth-redirect.component.scss'],
})
export class AuthRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly subscription: Subscription = new Subscription();

  codeRedeemer$ = this.route.queryParamMap.pipe(
    map(params => params.get('code')),
    filter(x => !!x),
    switchMap(code => this.authService.redeemCode(code!)),
    shareReplay(1)
  );

  navigateToHome$ = this.authService.isAuthenticated$.pipe(
    filter(x => x),
    switchMap(() => from(this.router.navigate(['/profile'])))
  );

  ngOnInit(): void {
    this.subscription.add(this.codeRedeemer$.subscribe());
    this.subscription.add(this.navigateToHome$.subscribe());
    this.subscription.add(this.authService.autoRefreshToken$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
