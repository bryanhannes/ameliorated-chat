export const getFromLocalStorage = <T>(
  key: string,
  initialValue: T | null = null
): T => {
  if (localStorage.getItem(key) === null && initialValue !== null) {
    patchLocalStorage(key, initialValue);
  }

  return JSON.parse(
    localStorage.getItem(key) || JSON.stringify(initialValue)
  ) as T;
};

export const patchLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
