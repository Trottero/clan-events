import { Component } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { share } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clan-list',
  templateUrl: './clan-list.component.html',
  styleUrls: ['./clan-list.component.scss'],
})
export class ClanListComponent {
  constructor(
    private readonly clanService: ClanService,
    private readonly router: Router
  ) {}

  clans$ = this.clanService.getClans().pipe(share());

  navigateToClan(clanName: string) {
    this.router.navigate(['clan', clanName]);
  }
}
