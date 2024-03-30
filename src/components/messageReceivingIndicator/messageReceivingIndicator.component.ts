import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MessageReceiver } from '../../services/messageReceiver.service';

const COUNTER_INTERVAL_MILISECONDS = 300;

@Component({
  selector: 'app-message-receiving-indicator',
  standalone: true,
  imports: [MatIconModule, MatBadgeModule],
  templateUrl: './messageReceivingIndicator.component.html',
  styleUrl: './messageReceivingIndicator.component.css'
})
export class MessageReceivingIndicator implements OnInit, OnDestroy {
  currentCounter: number = 0;

  constructor(public counterService: MessageReceiver) {

  }

  ngOnInit() {
    this.counterService.init(COUNTER_INTERVAL_MILISECONDS).subscribe(
      value => {
        this.currentCounter = value;
      }
    );
  }

  ngOnDestroy(): void {
    this.counterService.finish();
  }
}
