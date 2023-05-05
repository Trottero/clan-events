import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  public discordLoginUrl = this.configService.discordLoginUrl;

  public userName$ = this.userService.userName$;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  public logout(): void {
    this.userService.logout();
  }
}
