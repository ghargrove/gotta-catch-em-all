import { useCallback, useState } from "react";

type UseLocalStorageResult<T> = [
  T,
  (v: T | ((prev: T) => T)) => void,
  () => void,
];

/**
 * Retrieve a value from local storage.
 *
 * The return value will also provide a function to set the state and persist it
 * to local storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);

      return JSON.parse(storedValue ?? "");
    } catch (e) {
      console.error(
        e instanceof Error ? e.message : "Unknown error parsing localstorage"
      );
    }
  });

  const setValue = useCallback(
    (v: T | ((prev: T) => T)) => {
      const nextValue = v instanceof Function ? v(storedValue) : v;

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        setStoredValue(nextValue);
      } catch (e) {
        console.error(
          e instanceof Error ? e.message : "Unknown error setting localstorage"
        );
      }
    },
    [key, setStoredValue, storedValue]
  );

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue];
}
