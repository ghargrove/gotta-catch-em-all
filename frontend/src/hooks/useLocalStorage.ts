import { useCallback, useEffect, useState } from "react";

declare global {
  // Required to keep window.addEventListener happy for our local storage event
  interface WindowEventHandlersEventMap {
    "local-storage": StorageEvent;
  }
}

type UseLocalStorageResult<T> = [
  T | null,
  (v: T | ((prev: T | null) => T)) => void,
  () => void,
];

/**
 * Retrieve a value from local storage.
 *
 * The return value will also provide a function to set the state and persist it
 * to local storage
 */
export function useLocalStorage<T>(key: string): UseLocalStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    let storedValue: string | null = null;

    try {
      storedValue = window.localStorage.getItem(key);
    } catch (e) {
      console.error(
        e instanceof Error ? e.message : "Unknown error accessing localstorage"
      );

      return null;
    }

    try {
      return typeof storedValue === "string" ? JSON.parse(storedValue) : null;
    } catch {
      // Ignore parse error
      return null;
    }
  });

  const setValue = useCallback(
    (v: T | ((prev: T | null) => T)) => {
      const nextValue = v instanceof Function ? v(storedValue) : v;

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        setStoredValue(nextValue);

        window.dispatchEvent(new StorageEvent("local-storage", { key }));
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
    setStoredValue(null);

    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  }, [key]);

  // Register event listeners to keep the state in sync with storage changes
  useEffect(() => {
    const handler = (evt: StorageEvent) => {
      const { key } = evt;

      if (key === null) {
        return;
      }

      // Read the update value and update the state
      try {
        const updatedValue = window.localStorage.getItem(key);

        setStoredValue(
          typeof updatedValue === "string"
            ? JSON.parse(updatedValue)
            : updatedValue
        );
      } catch (e) {
        // No op
      }
    };

    window.addEventListener("storage", handler);
    window.addEventListener("local-storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("local-storage", handler);
    };
  });

  return [storedValue, setValue, removeValue];
}
