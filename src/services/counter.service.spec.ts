import { TestBed, tick, fakeAsync, flush } from '@angular/core/testing';

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

  it('should start timer', fakeAsync(() => {
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
    flush();
  }));
});
