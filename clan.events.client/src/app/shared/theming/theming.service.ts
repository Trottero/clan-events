import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, shareReplay } from 'rxjs';
import { Theme } from './theme';
import { hydrate } from 'src/app/common/hydrate.pipe';

interface ThemeState {
  theme: Theme;
}

const INITIAL_THEME_STATE: ThemeState = {
  theme: Theme.Unknown,
};

@Injectable({
  providedIn: 'root',
})
export class ThemingService implements OnDestroy {
  private readonly themeToClassMap = {
    [Theme.Unknown]: 'dark-theme',
    [Theme.Light]: 'light-theme',
    [Theme.Dark]: 'dark-theme',
  };

  private readonly _themeSubject = new BehaviorSubject<ThemeState>(
    INITIAL_THEME_STATE
  );

  private readonly _subscriptions = new Subscription();

  theme$: Observable<ThemeState> = this._themeSubject.pipe(
    hydrate('app-theme', INITIAL_THEME_STATE),
    shareReplay(1)
  );

  constructor() {
    this._subscriptions.add(
      this.theme$.subscribe(themeState => {
        this.setThemeClass(themeState.theme);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  setTheme(theme: Theme): void {
    this._themeSubject.next({ theme });
  }

  private setThemeClass(theme: Theme): void {
    const themeClass = this.themeToClassMap[theme];
    if (themeClass) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove(...Object.values(this.themeToClassMap));
      body.classList.add(themeClass);
    }
  }
}
