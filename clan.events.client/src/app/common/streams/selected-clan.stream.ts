import { Injectable } from '@angular/core';
import { distinctUntilChanged, shareReplay } from 'rxjs';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { Clan } from '@common/clan';
import { InjectableStream } from '../observable/injectable-stream';

@Injectable({
  providedIn: 'root',
})
export class SelectedClanStream extends InjectableStream<Clan | undefined> {
  constructor(selectedClanService: SelectedClanService) {
    super(
      selectedClanService.selectedClan$.pipe(
        distinctUntilChanged(),
        shareReplay(1)
      )
    );
  }
}
