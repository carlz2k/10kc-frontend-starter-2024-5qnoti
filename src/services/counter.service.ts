import { Injectable } from '@angular/core';
import { Observable, Subject, timer, map, startWith, switchMap, of } from 'rxjs';

// state transition
// start-pause-resume scenario: initialized -> inProgress -> paused -> inProgress
// start-pause-reset scenario: initialized -> inProgress -> paused -> initialized
// start-reset scenario: initialized -> inProgress -> initialized -> inProgress
const COUNTER_STATES = {
  initialized: 'INITIALIZED',
  paused: 'PAUSED',
  inProgress: 'IN_PROGRESS',
}

// the implementation of this service is stateful, thus, init and finish must be called
// before and after
@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private _action: Subject<string> = new Subject();
  private _currentValue = 0;
  private _currentState = COUNTER_STATES.initialized;

  constructor() {
  }

  /**
   * initialize service, must be called before calling
   * other service's methods
   * 
   * @param intervalInSecond seconds between the increment of the counter
   * 
   * @returns a new observable that allows user to control
   * the counter's behaviour
   */
  init(intervalInSecond: number) {
    this._reinitializeAction();
    return this._bindActionObservable(intervalInSecond);
  }

  /**
  * clean up the service (especially the observable) to avoid memory leak,
  * must be paired with the init method
  */
  finish() {
    this._action.complete();
    this._currentValue = 0;
    this._currentState = COUNTER_STATES.initialized;
  }

  start() {
    if (this._currentState === COUNTER_STATES.initialized || this._currentState === COUNTER_STATES.paused)
      this._action.next(COUNTER_STATES.inProgress);
  }

  stop() {
    if (this._currentState === COUNTER_STATES.inProgress) {
      this._currentValue--;
      this._action.next(COUNTER_STATES.paused);
    }
  }

  reset() {
    this._currentValue = 0;
    if (this._currentState === COUNTER_STATES.initialized)
      this._action.next(COUNTER_STATES.inProgress);
    else if (this._currentState === COUNTER_STATES.paused)
      this._action.next(COUNTER_STATES.initialized);
  }

  private _reinitializeAction() {
    if (this._action) {
      this.finish();
    }
    this._action = new Subject<string>();
  }

  private _bindActionObservable(intervalInMillisecond: number) {
    return this._action.pipe(
      switchMap(state => {
        this._currentState = state;
        if (state == COUNTER_STATES.inProgress) {
          // if start from a previous stop action, don't start the timer immediately
          // wait for an interval to pass, to avoid the counter to change too quickly.
          // also reset the previous counter increment
          return this._createNewInterval(intervalInMillisecond, intervalInMillisecond);
        } else if (state == COUNTER_STATES.paused) {
          return new Observable<number>();
        } else if (state == COUNTER_STATES.initialized) {
          // if stopped, reset the counter only
          // otherwise restart the count
          return of(this._currentValue);
        }

        return new Observable<number>();
      })
    );
  }

  private _createNewInterval(intervalInMillisecond: number, delayInMillisecond: number) {
    const timerObject = timer(delayInMillisecond, intervalInMillisecond);
    return timerObject.pipe(
      startWith(this._currentValue),
      map(() => {
        return this._currentValue++;
      }),
    );
  }
}
