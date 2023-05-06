import { Component } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { share } from 'rxjs';

@Component({
  selector: 'app-clan-list',
  templateUrl: './clan-list.component.html',
  styleUrls: ['./clan-list.component.scss'],
})
export class ClanListComponent {
  constructor(private readonly clanService: ClanService) {}

  clans$ = this.clanService.getClans().pipe(share());
}
