import { Component, inject } from '@angular/core';
import { ClanApiService } from '../../services/clan.api.service';
import { switchMap, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { SelectedClanService } from '../../services/selected-clan.service';
import { ClansService } from '../../services/clans.service';

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

  private readonly clanApiService = inject(ClanApiService);
  private readonly router = inject(Router);
  private readonly clansService = inject(ClansService);
  private readonly selectedClanService = inject(SelectedClanService);

  createClan() {
    this.formGroup.value$
      .pipe(switchMap(value => this.clanApiService.createClan(value.name)))
      .subscribe(result => {
        this.clansService.refreshClans();
        this.selectedClanService.setSelectedClan(result.name);
        this.router.navigate(['/clan', result.name]);
      });
  }
}
