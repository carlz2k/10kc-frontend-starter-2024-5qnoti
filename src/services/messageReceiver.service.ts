import { Injectable } from '@angular/core';
import { Subject, connectable, interval, map, of, startWith, switchMap, take, takeUntil, takeWhile, tap, timer } from 'rxjs';

// state transition
// start-pause-resume scenario: initialized -> inProgress -> paused -> inProgress
// start-pause-reset scenario: initialized -> inProgress -> paused -> initialized
// start-reset-reset-pause scenario: initialized -> inProgress -> restarted -> restarted -> pause
const MESSAGE_RECEIVER_STATES = {
  initialized: 'INITIALIZED',
  paused: 'PAUSED',
  inProgress: 'IN_PROGRESS',
  restarted: 'RESTARTED',
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
  private _destroyTrigger: Subject<void> = new Subject();

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
    this._destroyTrigger.next();
    this._destroyTrigger.complete();
    this._stateTransition.complete();
    this._currentCounter = 0;
    this._currentState = MESSAGE_RECEIVER_STATES.initialized;
  }

  start() {
    this._triggerNextState(MESSAGE_RECEIVER_ACTIONS.start);
  }

  stop() {
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

    // use connectable for multicast to support multiple subscribers
    const observable = connectable(this._stateTransition.pipe(
      switchMap(state => {
        this._currentState = state;

        // destroy previous pipeline
        this._destroyTrigger.next();

        if (state === MESSAGE_RECEIVER_STATES.inProgress || state === MESSAGE_RECEIVER_STATES.restarted) {
          return this._createNewInterval(intervalInMillisecond);
        }

        return of(this._currentCounter);
      })
    ));

    observable.connect();

    return observable;
  }

  private _createNewInterval(intervalInMillisecond: number) {
    const startValue = this._currentCounter;
    const timerObject = timer(0, intervalInMillisecond);
    return timerObject.pipe(
      takeUntil(this._destroyTrigger),
      // side effect for increasing counters
      tap((v) => {
        this._currentCounter = v + startValue;
      }),
      map(() => this._currentCounter)
    );
  }

  private _triggerNextState(action: string) {
    if (this._currentState === MESSAGE_RECEIVER_STATES.initialized) {
      if (action === MESSAGE_RECEIVER_ACTIONS.start) {
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
      } else if (action === MESSAGE_RECEIVER_ACTIONS.reset) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.restarted);
      }
    } else if (this._currentState === MESSAGE_RECEIVER_STATES.restarted) {
      if (action === MESSAGE_RECEIVER_ACTIONS.stop) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.paused);
      } else if (action === MESSAGE_RECEIVER_ACTIONS.reset) {
        this._stateTransition.next(MESSAGE_RECEIVER_STATES.restarted);
      }
    }
  }
}
