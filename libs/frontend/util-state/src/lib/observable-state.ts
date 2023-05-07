import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  observeOn,
  pipe,
  queueScheduler,
  Subject,
  takeUntil,
  UnaryFunction
} from 'rxjs';

const filterAndMapToT: <T>() => UnaryFunction<
  Observable<T | null>,
  Observable<T>
> = <T>() =>
  pipe(
    filter((v: T | null) => v !== null),
    map((v) => v as T)
  );

class StateSubject<T> extends BehaviorSubject<T> {
  public readonly syncState = this.asObservable().pipe(
    observeOn(queueScheduler)
  );
}

@Injectable()
export class ObservableState<T extends Record<string, unknown>>
  implements OnDestroy
{
  private readonly notInitializedError =
    'State is not initialized yet, call the initialize() method';
  private readonly destroy$$ = new Subject<void>();
  private readonly state$$ = new StateSubject<T | null>(null);

  /**
   * exposes the state as an observable. This observable is made hot in the initialize() function
   * Therefor we use a connectable that uses a ReplaySubject as its connector.
   */
  public readonly state$ = this.state$$.syncState.pipe(
    filterAndMapToT<T>(),
    distinctUntilChanged((previous: T, current: T) =>
      Object.keys(current).every(
        (key: string) => current[key as keyof T] === previous[key as keyof T]
      )
    ),
    takeUntil(this.destroy$$)
  );

  /**
   * Returns the current snapshot of the state
   */
  public get snapshot(): T {
    if (!this.state$$.value) {
      throw new Error(this.notInitializedError);
    }
    return this.state$$.value as T;
  }

  /**
   * Initializes the state and connects the optional inputState if needed.
   * When one of the inputs changes the store will get updated in a queued way.
   * That's why we need the queueScheduler. To ensure that the order is still correct.
   * The subscriptions made in this method will be auto cleaned up as well.
   * @param state: The initial state to store
   * @param inputState$: An observable that emits when the inputs change over time
   */
  public initialize(state: T, inputState$?: Observable<Partial<T>>): void {
    this.state$$.next(state);
    if (inputState$) {
      inputState$
        .pipe(takeUntil(this.destroy$$))
        .subscribe((res: Partial<T>) => this.patch(res));
    }
  }

  /**
   * Connects different observables to the store.
   * When these observables emit the store will get updated in a queued way.
   * That's why we need the queueScheduler. To ensure that the order is still correct.
   * The subscriptions made in this method will be auto cleaned up as well
   * @param object
   */
  public connect(object: Partial<{ [P in keyof T]: Observable<T[P]> }>): void {
    Object.keys(object).forEach((key: string) => {
      object[key as keyof T]
        ?.pipe(takeUntil(this.destroy$$))
        .subscribe((v: Partial<T>[keyof Partial<T>]) => {
          this.patch({ [key]: v } as Partial<T>);
        });
    });
  }

  /**
   * Returns the state when one of state properties matching the passed keys change.
   * The subscriptions made in this method will be auto cleaned up as well.
   * When this observable emits, the subscriber will get notified in a queued way.
   * That's why we need the queueScheduler. To ensure that the order is still correct.
   * @param keys: Keys where we want to get notified from when they change
   */
  public onlySelectWhen(keys: (keyof T)[]): Observable<T> {
    return this.state$$.syncState.pipe(
      map((v) => {
        return this.state$$.value;
      }),
      filterAndMapToT<T>(),
      distinctUntilChanged((previous: T, current: T) =>
        keys.every(
          (key: keyof T) => current[key as keyof T] === previous[key as keyof T]
        )
      ),
      takeUntil(this.destroy$$)
    );
  }

  /**
   * Patches part of the state in one emisson
   * @param object: partial of the state
   */
  protected patch(object: Partial<T>): void {
    if (!this.state$$.value) {
      throw new Error(this.notInitializedError);
    }

    let newState: T = { ...this.state$$.value };
    Object.keys(object).forEach((key: string) => {
      newState = { ...newState, [key]: object[key as keyof T] };
    });
    this.state$$.next(newState);
  }

  /**
   * Returns an object with only the properties passed in the keys params.
   * The object contains observables instead of regular objects.
   * This function is used inside the connect() method to pick
   * pieces of state from E.G other observable states
   * ```typescript
   * connect({
   *   ...this.userState.pick(['address', 'auth']),
   *   ...this.applicationState.pick(['applications', 'currentApplication'])
   * })
   * ```
   * @param keys
   */
  public pick(
    keys: (keyof T)[]
  ): Partial<{ [P in keyof T]: Observable<T[P]> }> {
    const returnObj: Partial<{ [P in keyof T]: Observable<T[P]> }> = {};
    keys.forEach((key: keyof T) => {
      returnObj[key] = this.onlySelectWhen([key]).pipe(
        map((state: T) => state[key])
      );
    });
    return returnObj;
  }

  /**
   * Used to select a piece of state and expose it as an observable
   * @param key: The key of the piece of state we want to select
   */
  public select<P extends keyof T>(key: P): Observable<T[P]> {
    return this.onlySelectWhen([key]).pipe(map((state) => state[key]));
  }

  /**
   * Cleans up the entire instance
   */
  public ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
