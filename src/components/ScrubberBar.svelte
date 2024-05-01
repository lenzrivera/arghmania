<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  /**
   * @type {number}
   */
  export let currTime;

  /**
   * @type {number}
   */
  export let minTime;

  /**
   * @type {number}
   */
  export let maxTime;

  function handleScrub(e) {
    dispatch('scrub', Number(e.target.value));
  }
</script>

<input
  type="range"
  min={minTime}
  max={maxTime}
  value={currTime}
  on:input={handleScrub}
/>

<style>
  input {
    width: 100%;
    height: 8px;

    appearance: none;
    background-color: #7a7a7a;
    border-radius: 5px;
  }

  input::-webkit-slider-thumb {
    width: 16px;
    height: 16px;

    appearance: none;
    background-color: #d7d7d7;
    border-radius: 50%;
  }

  input:hover::-webkit-slider-thumb {
    background-color: #e5e5e5;
  }

  input::-moz-range-thumb {
    width: 16px;
    height: 16px;

    appearance: none;
    background-color: #d7d7d7;
    border-radius: 50%;
  }
</style>
