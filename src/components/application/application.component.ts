import { Component } from '@angular/core';
import { MessageReceiverButtonGroup } from '../message-receiver-button-group/message-receiver-button-group.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [MessageReceiverButtonGroup],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

}
