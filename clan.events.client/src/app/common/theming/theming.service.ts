import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Theme, themeFromString } from './theme';
import { Memoized } from '../decorators/memoized.decorator';

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

  @Memoized public get theme$(): Observable<Theme> {
    return this._themeSubject.asObservable();
  }

  constructor() {
    this.getThemeFromLocalStorage();

    this._subscriptions.add(
      this.theme$.subscribe((theme) => {
        localStorage.setItem('theme', theme);
        this.setThemeClass(theme);
      }),
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public setTheme(theme: Theme): void {
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
