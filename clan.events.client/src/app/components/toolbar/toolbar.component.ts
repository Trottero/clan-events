import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfigService } from 'src/app/config/config.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  discordLoginUrl = this.configService.discordLoginUrl;

  userName$ = this.userService.userName$;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  logout() {
    this.userService.logout();
  }
}
