import { writable } from 'svelte/store';

/**
 * @param {number} initialValue
 * @param {number} change
 * @param {number} rate
 */
export function animatedValue(initialValue, change, rate) {
  // Use a store for reactivity.
  const store = writable(initialValue);

  let loopId = null;
  let previousSetValue = initialValue;

  /**
   * @param {number} nextValue
   */
  function updateValue(nextValue) {
    store.update(currValue => {
      const steppedValue =
        nextValue < currValue ? currValue - change : currValue + change;

      if (
        (nextValue < currValue && steppedValue <= nextValue) ||
        (nextValue > currValue && steppedValue >= nextValue)
      ) {
        clearInterval(loopId);
        return nextValue;
      }

      return steppedValue;
    });
  }

  return {
    subscribe: store.subscribe,

    /**
     * @param {number} nextValue
     */
    set(nextValue) {
      if (loopId !== null) {
        clearInterval(loopId);
        store.set(previousSetValue);
      }

      previousSetValue = nextValue;
      loopId = setInterval(() => updateValue(nextValue), rate);
    },
  };
}
