import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { Theme } from '../theme';
import { ThemingService } from '../theming.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleThemeComponent {
  theme$: Observable<Theme> = this.themingService.theme$.pipe(
    map(themeState => themeState.theme)
  );

  isToggleChecked$: Observable<boolean> = this.theme$.pipe(
    map(theme => theme === Theme.Dark)
  );

  constructor(private readonly themingService: ThemingService) {}

  onToggleChange(): void {
    this.theme$.pipe(take(1)).subscribe(theme => {
      if (theme === Theme.Dark) {
        this.themingService.setTheme(Theme.Light);
      } else {
        this.themingService.setTheme(Theme.Dark);
      }
    });
  }
}
