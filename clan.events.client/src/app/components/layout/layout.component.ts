import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ClanWithRole } from '@common/clan';
import { FormControl } from '@ngneat/reactive-forms';
import {
  Subscription,
  combineLatest,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ClanService } from 'src/app/clan/services/clan.service';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { hydrate } from 'src/app/common/hydrate.pipe';
import { ConfigService } from 'src/app/config/config.service';
import { FILTERED, filterMap } from 'src/app/shared/operators/filter-map';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';
import { UserService } from 'src/app/user/user.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  discordLoginUrl = this.configService.discordLoginUrl;

  userName$ = this.userService.userName$;

  isAuthenticated$ = this.authService.isAuthenticated$;

  selectedClan$ = combineLatest([
    this.isAuthenticated$,
    this.selectedClanService.selectedClan$,
  ]).pipe(
    map(([_, selectedClan]) => selectedClan),
    shareReplay(1)
  );

  clans$ = this.selectedClanService.clans$;

  selectedClanControl = new FormControl<string | undefined>(undefined);

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly selectedClanService: SelectedClanService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedClan$.pipe(notNullOrUndefined()).subscribe(selectedClan => {
        this.selectedClanControl.setValue(selectedClan.name, {
          emitEvent: false,
        });
      })
    );

    this.subscriptions.add(
      this.selectedClanControl.value$.subscribe(selectedClanName => {
        this.selectedClanService.setSelectedClan(selectedClanName);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  logout(): void {
    this.userService.logout();
  }
}
