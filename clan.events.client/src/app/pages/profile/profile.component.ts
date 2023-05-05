import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from 'src/app/user/user.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userState$ = this.userService.userState$;

  constructor(private readonly userService: UserService) {}
}
