import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MessageReceiver } from '../../services/messageReceiver.service';

const COUNTER_INTERVAL_MILISECONDS = 300;

@Component({
  selector: 'app-message-receiving-indicator',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './messageReceivingIndicator.component.html',
  styleUrl: './messageReceivingIndicator.component.css'
})
export class MessageReceivingIndicator implements OnInit, OnDestroy {
  currentCounter: number = 0;
  startDisabled: boolean = false;
  stopDisabled: boolean = true;
  resetDisabled: boolean = true;

  // use constructor injection to allow the counter service to
  // be shared in case when the current counter value needs
  // to be shared between components
  // otherwise, should use "provides"
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

  start() {
    this._toggleButtonStates();
    this.counterService.start();
  }

  stop() {
    this._toggleButtonStates();
    this.counterService.stop();
  }

  reset() {
    this.counterService.reset();
    if (this.stopDisabled) {
      this.resetDisabled = true;
    }
  }

  private _toggleButtonStates() {
    this.startDisabled = !this.startDisabled;
    this.stopDisabled = !this.stopDisabled;

    this.resetDisabled = false;
  }
}
