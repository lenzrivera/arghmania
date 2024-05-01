<script>
  /**
   * @type {?boolean}
   */
  export let disabled = false;

  /**
   * @type {string}
   */
  export let icon;
</script>

<button class:disabled {disabled} on:click>
  <span class="material-symbols-outlined">{icon}</span>
</button>

<style>
  button {
    /* Fixes extra space at the bottom (which exists for some reason). */
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: transparent;
    border: none;
    border-radius: 0.25rem;

    transition: background-color 75ms ease-in-out;
  }

  button[disabled] {
    pointer-events: none;
  }

  button:not(.disabled):hover {
    background-color: rgb(210 210 210 / 0.85);
  }

  button:not(.disabled):active {
    background-color: rgb(0 0 0 / 0.25);
  }
</style>
