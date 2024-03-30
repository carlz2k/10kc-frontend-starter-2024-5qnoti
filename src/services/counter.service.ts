import { Injectable } from '@angular/core';
import { Observable, Subject, timer, map, startWith, switchMap } from 'rxjs';

const CounterAction = {
  start: 'START',
  stop: 'STOP',
  reset: 'RESET',
}

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private _action: Subject<string>;
  private _currentValue = 0;
  private _stopTriggered = false;

  constructor() {
    this._action = new Subject<string>();
  }

  init(intervalInSecond: number) {
    return this._action.pipe(
      switchMap(action => {
        if (action == CounterAction.start) {
          // if start from a previous stop action, don't start the timer immediately
          // wait for an interval to pass, to avoid the counter to change too quickly.
          const delay = this._stopTriggered ? intervalInSecond : 0;
          return this._newInterval(intervalInSecond, delay);
        } else if (action == CounterAction.stop) {
          this._stopTriggered = true;
          return new Observable<number>();
        } else if (action == CounterAction.reset) {
          this._currentValue = 0;
          return this._newInterval(intervalInSecond, 0);
        }

        return new Observable<number>();
      })
    );
  }

  finish() {
    this._action.complete();
    this._currentValue = 0;
    this._stopTriggered = false;
  }

  start() {
    this._action.next(CounterAction.start);
  }

  stop() {
    this._action.next(CounterAction.stop);
  }

  reset() {
    this._currentValue = 0;
    this._action.next(CounterAction.reset);
  }

  _newInterval(intervalInSecond: number, delayInSecond: number) {
    return timer(delayInSecond, intervalInSecond).pipe(
      startWith(this._currentValue),
      map(() => {
        return this._currentValue++;
      }),
    );
  }
}
