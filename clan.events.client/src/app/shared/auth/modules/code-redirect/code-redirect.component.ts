import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-code-redirect',
  templateUrl: './code-redirect.component.html',
  styleUrls: ['./code-redirect.component.scss'],
})
export class CodeRedirectComponent {
  loadingDots$: Observable<string> = interval(1000).pipe(
    map(i => '.'.repeat((i % 4) + 1))
  );
}
