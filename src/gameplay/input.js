const keyConfig = new Map([
  ['d', 0],
  ['f', 1],
  ['j', 2],
  ['k', 3],
]);

export const inputKeys = {
  /**
   * @param {string} key
   */
  includes(key) {
    return keyConfig.has(key);
  },

  /**
   * @param {string} key
   */
  getTrackIndex(key) {
    if (!this.includes(key)) {
      throw new Error('Key has no corresponding track index.');
    }

    return keyConfig.get(key);
  },
};

export function gameKeyInput(node) {
  const pressedKeys = new Set();

  function handleKeydown(e) {
    if (pressedKeys.has(e.key)) {
      return;
    }

    node.dispatchEvent(new CustomEvent('keyhold', { detail: e.key }));
    pressedKeys.add(e.key);
  }

  function handleKeyup(e) {
    node.dispatchEvent(new CustomEvent('keyrelease', { detail: e.key }));
    pressedKeys.delete(e.key);
  }

  node.addEventListener('keydown', handleKeydown);
  node.addEventListener('keyup', handleKeyup);

  return {
    destroy() {
      node.removeEventListener('keydown', handleKeydown);
      node.removeEventListener('keyup', handleKeyup);
    },
  };
}
