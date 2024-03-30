import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';

import { CounterService } from './counter.service';

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should keep the counter value after start', fakeAsync(() => {
    let counter = 0;
    service.init(100).subscribe((v:number) => {
      counter = v;
    });
    service.start();
    tick(200);
    expect(counter).toEqual(2);
    service.stop();
    service.start();
    tick(200);
    expect(counter).toEqual(4);
    
    discardPeriodicTasks();
  }));

  it('should reset the counter while timer is running', fakeAsync(() => {
    let counter = 0;
    service.init(100).subscribe((v:number) => {
      counter = v;
    });
    service.start();
    tick(200);
    expect(counter).toEqual(2);
    service.reset();
    tick(300);
    expect(counter).toEqual(2);
    
    discardPeriodicTasks();
  }));

  it('should reset the counter after pause', fakeAsync(() => {
    let counter = 0;
    service.init(100).subscribe((v:number) => {
      counter = v;
    });
    service.start();
    tick(200);
    expect(counter).toEqual(2);
    service.stop();
    service.reset();
    tick(100);
    expect(counter).toEqual(0);
    service.start();
    tick(200);
    expect(counter).toEqual(2);
    
    discardPeriodicTasks();
  }));
});
