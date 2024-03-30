import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageReceivingIndicator } from './messageReceivingIndicator.component';
import { MessageReceiver } from '../../services/messageReceiver.service';
import { Observable } from 'rxjs';

describe('CounterComponent', () => {
  let component: MessageReceivingIndicator;
  let fixture: ComponentFixture<MessageReceivingIndicator>;
  let messageReceiver: MessageReceiver;

  beforeEach(async () => {
    const messageReceiverStub = jasmine.createSpyObj(["start", "stop", "reset", "init", "finish"]);
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

  it('should start', () => {
    expect(component).toBeTruthy();
  });

  it('click start button should disable start button and enable stop button', () => {
    expect(component.stopDisabled).toBeTruthy();
    expect(component.startDisabled).toBeFalsy();
    component.start();
    expect(messageReceiver.start).toHaveBeenCalled();
    expect(component.startDisabled).toBeTruthy();
    expect(component.stopDisabled).toBeFalsy();
  });

  it('click stop button should disable stop button and enable start button', () => {
    expect(component.stopDisabled).toBeTruthy();
    expect(component.startDisabled).toBeFalsy();
    component.start();
    component.stop();
    expect(messageReceiver.start).toHaveBeenCalled();
    expect(messageReceiver.stop).toHaveBeenCalled();
    expect(component.startDisabled).toBeFalsy();
    expect(component.stopDisabled).toBeTruthy();
  });

  it('click start button should enable reset button', () => {
    expect(component.resetDisabled).toBeTruthy();
    component.start();
    expect(component.resetDisabled).toBeFalsy();
    component.reset();
    expect(messageReceiver.reset).toHaveBeenCalled();
    expect(component.resetDisabled).toBeFalsy();
  });

  it('click stop button then reset button should disable reset button', () => {
    expect(component.resetDisabled).toBeTruthy();
    component.start();
    expect(component.resetDisabled).toBeFalsy();
    component.stop();
    expect(component.resetDisabled).toBeFalsy();
    component.reset();
    expect(component.resetDisabled).toBeTruthy();
  });
  
});
