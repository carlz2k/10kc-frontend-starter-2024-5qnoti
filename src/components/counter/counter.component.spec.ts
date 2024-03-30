import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterComponent } from './counter.component';
import { CounterService } from '../../services/counter.service';
import { Observable } from 'rxjs';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let counterService: CounterService;

  beforeEach(async () => {
    const counterServiceStub = jasmine.createSpyObj(["start", "stop", "reset", "init", "finish"]);
    counterServiceStub.init.and.returnValue(new Observable());

    await TestBed.configureTestingModule({
      imports: [CounterComponent],
      providers: [{ provide: CounterService, useValue: counterServiceStub }],
    }).compileComponents();

    counterService = TestBed.inject(CounterService);

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create the counter component', () => {
    expect(counterService.init).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('should start', () => {
    expect(component).toBeTruthy();
  });

  it('click start button should disable start button and enable stop button', () => {
    expect(component.stopDisabled).toBeTruthy();
    expect(component.startDisabled).toBeFalsy();
    component.start();
    expect(counterService.start).toHaveBeenCalled();
    expect(component.startDisabled).toBeTruthy();
    expect(component.stopDisabled).toBeFalsy();
  });

  it('click stop button should disable stop button and enable start button', () => {
    expect(component.stopDisabled).toBeTruthy();
    expect(component.startDisabled).toBeFalsy();
    component.start();
    component.stop();
    expect(counterService.start).toHaveBeenCalled();
    expect(counterService.stop).toHaveBeenCalled();
    expect(component.startDisabled).toBeFalsy();
    expect(component.stopDisabled).toBeTruthy();
  });

  it('click start button should enable reset button', () => {
    expect(component.resetDisabled).toBeTruthy();
    component.start();
    expect(component.resetDisabled).toBeFalsy();
    component.reset();
    expect(counterService.reset).toHaveBeenCalled();
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
