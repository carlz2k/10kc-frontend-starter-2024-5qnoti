import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MessageReceiver } from '../../services/messageReceiver.service';
import { MessageReceivingIndicator } from '../messageReceivingIndicator/messageReceivingIndicator.component';

@Component({
  selector: 'app-message-receiver-button-group',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MessageReceivingIndicator],
  templateUrl: './message-receiver-button-group.component.html',
  styleUrl: './message-receiver-button-group.component.css'
})
export class MessageReceiverButtonGroup {
  startDisabled: boolean = false;
  stopDisabled: boolean = true;
  resetDisabled: boolean = true;

  // use constructor injection to allow the counter service to
  // be shared in case when the current counter value needs
  // to be shared between components
  // otherwise, should use "provides"
  constructor(public counterService: MessageReceiver) {

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
