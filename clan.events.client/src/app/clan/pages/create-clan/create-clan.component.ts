import { Component, inject } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { switchMap, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { SelectedClanService } from '../../services/selected-clan.service';

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
  private readonly _selectedClanService = inject(SelectedClanService);

  createClan() {
    this.formGroup.value$
      .pipe(switchMap(value => this._clanService.createClan(value.name)))
      .subscribe(result => {
        this._selectedClanService.setSelectedClan(result.name);
        this._router.navigate(['/clan', result.name]);
      });
  }
}
