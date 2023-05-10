import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  discordLoginUrl = this.configService.discordLoginUrl;

  userName$ = this.userService.userName$;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  logout(): void {
    this.userService.logout();
  }
}
