import { Component } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { delay, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-clan',
  templateUrl: './create-clan.component.html',
  styleUrls: ['./create-clan.component.scss'],
})
export class CreateClanComponent {
  clanModel = {
    name: '',
  };

  constructor(
    private readonly clanService: ClanService,
    private readonly router: Router
  ) {}

  createClan() {
    this.clanService
      .createClan(this.clanModel.name)
      .pipe(
        delay(1000),
        switchMap(result => this.router.navigate(['/clan', result.name]))
      )
      .subscribe();
  }
}
