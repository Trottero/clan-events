import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Memoize } from 'typescript-memoize';
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

  private _themeSubject = new BehaviorSubject<Theme>(Theme.Dark);

  private _subscriptions = new Subscription();

  @Memoize() public get theme$(): Observable<Theme> {
    return this._themeSubject.asObservable();
  }

  constructor() {
    this.getThemeFromLocalStorage();

    this._subscriptions.add(
      this.theme$.subscribe((theme) => {
        localStorage.setItem('theme', theme);
        this.setThemeClass(theme);
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public setTheme(theme: Theme) {
    this._themeSubject.next(theme);
  }

  private getThemeFromLocalStorage() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.setTheme(themeFromString(theme));
    }
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
