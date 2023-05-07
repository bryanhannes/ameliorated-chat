import { SimpleChange, SimpleChanges } from '@angular/core';

import { InputStateModel } from './input-state-model';
import { getListOfInputKeys } from './utils';

export function InputState() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, key: string): any {
    const secretModel = `_${key}Model`;
    const accessorModel = `${key}Model`;

    const originalNgOnChanges = target.constructor.prototype.ngOnChanges;
    const originalNgOnDestroy = target.constructor.prototype.ngOnDestroy;
    const originalNgOnInit = target.constructor.prototype.ngOnInit;

    // monkey patch ngOnInit
    target.ngOnInit = function (): void {
      const simpleChangesToPass: SimpleChanges = {};
      getListOfInputKeys(this).forEach((inputKey) => {
        simpleChangesToPass[inputKey] = new SimpleChange(
          this[inputKey],
          this[inputKey],
          true
        );
      });

      this[accessorModel].update(simpleChangesToPass);

      // if ngOnChanges is implemented execute it as well
      if (originalNgOnInit) {
        originalNgOnInit.apply(this);
      }
    };

    // monkey patch ngOnChanges
    target.ngOnChanges = function (simpleChanges: SimpleChanges): void {
      // send changes to model
      this[accessorModel].update(simpleChanges); // send changes to model

      // if ngOnChanges is implemented execute it as well
      if (originalNgOnChanges) {
        originalNgOnChanges.apply(this, [simpleChanges]);
      }
    };

    // monkey patch ngOnDestroy
    target.ngOnDestroy = function (): void {
      // if ngOnDestroy is implemented execute it as well
      if (originalNgOnDestroy) {
        originalNgOnDestroy.apply(this, []);
      }

      // clean up
      this[accessorModel].destroy();
    };

    // hold the model on the instance as a secret variable
    // we need this because otherwise the InputStateModel is shared
    Object.defineProperty(target, accessorModel, {
      get() {
        if (this[secretModel]) {
          return this[secretModel];
        }

        this[secretModel] = new InputStateModel();

        return this[secretModel];
      }
    });

    return {
      get(): InputStateModel<Record<string, unknown>> {
        return this[accessorModel].state$;
      },
      set(): void {
        throw new Error(
          'You cannot set this property in the Component if you use @InputState'
        );
      }
    };
  };
}
