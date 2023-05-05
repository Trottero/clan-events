import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemingService } from '../theming.service';
import { Observable, map, take } from 'rxjs';
import { Theme } from '../theme';
import { Memoized } from 'src/app/common/decorators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleThemeComponent {
  public theme$: Observable<Theme> = this.themingService.theme$;

  public isToggleChecked$: Observable<boolean> = this.theme$.pipe(
    map((theme) => theme === Theme.Dark)
  );

  constructor(private readonly themingService: ThemingService) {}

  public onToggleChange() {
    this.theme$.pipe(take(1)).subscribe((theme) => {
      if (theme === Theme.Dark) {
        this.themingService.setTheme(Theme.Light);
      } else {
        this.themingService.setTheme(Theme.Dark);
      }
    });
  }
}
