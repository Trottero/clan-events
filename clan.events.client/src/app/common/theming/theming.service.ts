import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Theme, themeFromString } from './theme';
import { hydrate } from '../hydrate.pipe';

@Injectable({
  providedIn: 'root',
})
export class ThemingService implements OnDestroy {
  private readonly themeToClassMap = {
    [Theme.Unknown]: 'dark-theme',
    [Theme.Light]: 'light-theme',
    [Theme.Dark]: 'dark-theme',
  };

  private readonly _themeSubject = new BehaviorSubject<Theme>(Theme.Dark);

  private readonly _subscriptions = new Subscription();

  public theme$: Observable<Theme> = this._themeSubject.pipe(
    hydrate('app-theme', Theme.Unknown as Theme)
  );

  constructor() {
    this._subscriptions.add(
      this.theme$.subscribe((theme) => {
        this.setThemeClass(theme);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  setTheme(theme: Theme): void {
    this._themeSubject.next(theme);
  }

  private setThemeClass(theme: Theme) {
    const themeClass = this.themeToClassMap[theme];
    if (themeClass) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove(...Object.values(this.themeToClassMap));
      body.classList.add(themeClass);
    }
  }
}
