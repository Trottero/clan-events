import { Component, inject } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-clan',
  templateUrl: './create-clan.component.html',
  styleUrls: ['./create-clan.component.scss'],
})
export class CreateClanComponent {
  name = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  formGroup = new FormGroup({
    name: this.name,
  });

  private readonly _clanService = inject(ClanService);
  private readonly _router = inject(Router);

  createClan() {
    this.formGroup.value$
      .pipe(
        switchMap(value => this._clanService.createClan(value.name)),
        switchMap(result => this._router.navigate(['/clan', result.name]))
      )
      .subscribe();
  }
}
