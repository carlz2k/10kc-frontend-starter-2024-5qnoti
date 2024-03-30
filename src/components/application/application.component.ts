import { Component } from '@angular/core';
import { MessageReceivingIndicator } from '../messageReceivingIndicator/messageReceivingIndicator.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [MessageReceivingIndicator],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

}
