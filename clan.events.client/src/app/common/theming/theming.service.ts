import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Theme, themeFromString } from './theme';

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

  theme$: Observable<Theme> = this._themeSubject.asObservable();

  constructor() {
    this.getThemeFromLocalStorage();

    this._subscriptions.add(
      this.theme$.subscribe(theme => {
        localStorage.setItem('theme', theme);
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

  private getThemeFromLocalStorage(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.setTheme(themeFromString(theme));
    }
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
