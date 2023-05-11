import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ClansService } from 'src/app/clan/services/clans.service';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { ConfigService } from 'src/app/config/config.service';
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
  selectedClan$ = this.selectedClanService.selectedClan$;
  clans$ = inject(ClansService).clans$;

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
      this.selectedClanControl.valueChanges.subscribe(selectedClanName => {
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
