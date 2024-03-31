import { Injectable } from '@angular/core';
import { Observable, Subject, timer, map, startWith, switchMap, of } from 'rxjs';

// state transition
// start-pause-resume scenario: initialized -> inProgress -> paused -> inProgress
// start-pause-reset scenario: initialized -> inProgress -> paused -> initialized
// start-reset scenario: initialized -> inProgress -> initialized -> inProgress
const MESSAGE_RECEIVER_STATES = {
  initialized: 'INITIALIZED',
  paused: 'PAUSED',
  inProgress: 'IN_PROGRESS',
}

const MESSAGE_RECEIVER_ACTIONS = {
  start: 'START',
  stop: 'STOP',
  reset: 'RESET'
}

// the implementation of this service is stateful, thus, init and finish must be called
// before and after
// it is probably good enough to this demo as we only have one subscriber
// if we have multiple subscribers, we probably should
// 1) have a shared observable if multiple subscribers need to share the same data
// 2) alow each subscriber will have its own observable and own state machine
@Injectable({
  providedIn: 'root'
})
export class MessageReceiver {
  private _stateTransition: Subject<string> = new Subject();
  private _currentCounter = 0;
  private _currentState = MESSAGE_RECEIVER_STATES.initialized;

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
    this._stateTransition.complete();
    this._currentCounter = 0;
    this._currentState = MESSAGE_RECEIVER_STATES.initialized;
  }

  start() {
    this._triggerNextState(MESSAGE_RECEIVER_ACTIONS.start);
  }

  stop() {
    if (this._currentState === MESSAGE_RECEIVER_STATES.inProgress) {
      this._currentCounter--;
    }
    this._triggerNextState(MESSAGE_RECEIVER_ACTIONS.stop);
  }

  reset() {
    this._currentCounter = 0;
    this._triggerNextState(MESSAGE_RECEIVER_ACTIONS.reset);
  }

  private _reinitializeAction() {
    if (this._stateTransition) {
      this.finish();
    }
    this._stateTransition = new Subject<string>();
  }

  private _bindActionObservable(intervalInMillisecond: number) {
    // using an action/event driven pattern
    // to return different data streams based on
    // the current state (via switchMap)
    return this._stateTransition.pipe(
      switchMap(state => {
        this._currentState = state;
        if (state == MESSAGE_RECEIVER_STATES.inProgress) {
          // if start from a previous stop action, don't start the timer immediately
          // wait for an interval to pass, to avoid the counter to change too quickly.
          // also reset the previous counter increment
          return this._createNewInterval(intervalInMillisecond, intervalInMillisecond);
        } else if (state == MESSAGE_RECEIVER_STATES.paused) {
          return new Observable<number>();
        } else if (state == MESSAGE_RECEIVER_STATES.initialized) {
          // if stopped, reset the counter only
          // otherwise restart the count
          return of(this._currentCounter);
        }

        return new Observable<number>();
      })
    );
  }

  private _createNewInterval(intervalInMillisecond: number, delayInMillisecond: number) {
    const timerObject = timer(delayInMillisecond, intervalInMillisecond);
    return timerObject.pipe(
      startWith(this._currentCounter),
      map(() => {
        return this._currentCounter++;
      }),
    );
  }

  private _triggerNextState(action: string) {
    if (this._currentState === MESSAGE_RECEIVER_STATES.initialized) {
      if (action === MESSAGE_RECEIVER_ACTIONS.start || action === MESSAGE_RECEIVER_ACTIONS.reset) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.inProgress);
      }
    } else if (this._currentState === MESSAGE_RECEIVER_STATES.paused) {
      if (action === MESSAGE_RECEIVER_ACTIONS.start) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.inProgress);
      } else if (action === MESSAGE_RECEIVER_ACTIONS.reset) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.initialized);
      }
    } else if (this._currentState === MESSAGE_RECEIVER_STATES.inProgress) {
      if (action === MESSAGE_RECEIVER_ACTIONS.stop) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.paused);
      }
    }
  }
}
