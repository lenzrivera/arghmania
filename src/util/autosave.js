const SAVE_DELAY = 700;

/**
 * @param {function} callback
 */
export function createAutoSaveHandler(callback) {
  let timeoutId = null;

  function handleChange() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    setTimeout(() => {
      callback();
      timeoutId = null;
    }, SAVE_DELAY);
  }

  return handleChange;
}
