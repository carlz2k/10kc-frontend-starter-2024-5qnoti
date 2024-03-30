import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageReceivingIndicator } from './messageReceivingIndicator.component';
import { MessageReceiver } from '../../services/messageReceiver.service';
import { Observable } from 'rxjs';

describe('CounterComponent', () => {
  let component: MessageReceivingIndicator;
  let fixture: ComponentFixture<MessageReceivingIndicator>;
  let messageReceiver: MessageReceiver;

  beforeEach(async () => {
    const messageReceiverStub = jasmine.createSpyObj(["init", "finish"]);
    messageReceiverStub.init.and.returnValue(new Observable());

    await TestBed.configureTestingModule({
      imports: [MessageReceivingIndicator],
      providers: [{ provide: MessageReceiver, useValue: messageReceiverStub }],
    }).compileComponents();

    messageReceiver = TestBed.inject(MessageReceiver);

    fixture = TestBed.createComponent(MessageReceivingIndicator);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create the counter component', () => {
    expect(messageReceiver.init).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
});
