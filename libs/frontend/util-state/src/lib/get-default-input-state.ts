export function getDefaultInputState<T>(target: any): T {
  const returnObj: T = {} as T;
  Object.keys(target.constructor.ɵcmp.inputs)
    .map((key) => target.constructor.ɵcmp.inputs[key])
    .forEach((inputKey: keyof T) => {
      returnObj[inputKey] = target[inputKey];
    });
  return returnObj;
}
