import { SimpleChanges } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
  Subject,
  switchMap,
  takeUntil
} from 'rxjs';

const errorText =
  'State must be initialized. Did you forgot to call the update method?';

export class InputStateModel<T extends Record<string, unknown>> {
  private readonly initialized$$ = new BehaviorSubject<boolean>(false);
  private readonly destroy$$ = new Subject<void>();
  private state$$: BehaviorSubject<T> | undefined;
  public readonly state$: Observable<T> = this.initialized$$.pipe(
    filter((v) => v),
    switchMap(() => {
      if (!this.state$$) {
        throw new Error(errorText);
      }
      return this.state$$;
    }),
    distinctUntilChanged((previous: T, current: T) => {
      const keys = Object.keys(current);
      return keys.every((key) => {
        return current[key] === previous[key];
      });
    }),
    takeUntil(this.destroy$$)
  );

  public get snapshot(): T {
    if (!this.state$$) {
      throw new Error(errorText);
    }
    return this.state$$.value;
  }

  public update(changes: SimpleChanges): void {
    const keys = Object.keys(changes);
    if (!this.state$$) {
      const state: T = {} as T;
      keys.forEach((key) => {
        state[key as keyof T] = changes[key].currentValue;
      });
      this.state$$ = new BehaviorSubject<T>(state);
      this.initialized$$.next(true);
    } else {
      const state: T = { ...this.state$$?.value } as T;
      keys.forEach((key) => {
        if (changes[key].currentValue !== changes[key].previousValue) {
          state[key as keyof T] = changes[key].currentValue;
        }
      });
      this.state$$.next(state);
    }
  }

  public destroy(): void {
    this.destroy$$.next();
  }
}
