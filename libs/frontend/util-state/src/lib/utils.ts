export function getListOfInputKeys<T>(target: any): (keyof T)[] {
  const inputs =
    target.constructor.ɵcmp?.inputs ?? target.constructor.ɵdir?.inputs ?? null;

  if (inputs == null) {
    throw new Error('Target was not a component or directive instance!');
  }

  return Object.keys(inputs).map((key) => inputs[key]);
}

/**
 * Gets the inputs from a component as an object
 * @param target
 */
export function getInputState<T>(target: any): T {
  const returnObj: T = {} as T;
  getListOfInputKeys<T>(target).forEach((inputKey: keyof T) => {
    returnObj[inputKey] = target[inputKey];
  });
  return returnObj;
}
