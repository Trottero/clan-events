import { Component } from '@angular/core';
import { EventModel } from 'clan.events.common';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  public events: EventModel[] = [
    {
      id: '1',
      name: 'Event 1',
    },
    {
      id: '2',
      name: 'Event 2',
    },
  ];
}
