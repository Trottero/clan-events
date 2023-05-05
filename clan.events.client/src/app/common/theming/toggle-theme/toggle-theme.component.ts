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
  constructor(private readonly themingService: ThemingService) {}

  @Memoized public get isToggleChecked$(): Observable<boolean> {
    return this._theme$.pipe(map((theme) => theme === Theme.Dark));
  }

  @Memoized private get _theme$(): Observable<Theme> {
    return this.themingService.theme$;
  }

  public onToggleChange(): void {
    this._theme$.pipe(take(1)).subscribe((theme) => {
      if (theme === Theme.Dark) {
        this.themingService.setTheme(Theme.Light);
      } else {
        this.themingService.setTheme(Theme.Dark);
      }
    });
  }
}
