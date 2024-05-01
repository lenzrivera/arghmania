<script context="module">
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';

  const DEFAULT_BACKGROUND = 'black';
  const DEFAULT_DIM_AMOUNT = 0.45;
  const FADE_DURATION = 225;

  let background = writable(DEFAULT_BACKGROUND);
  let nextBackground = writable('');

  let dimAmount = writable(DEFAULT_DIM_AMOUNT);

  /**
   * @param {number} amount
   */
  export function setDimAmount(amount) {
    dimAmount.set(amount);
  }

  /**
   * @param {string} backgroundURI
   */
  export function setBackground(backgroundURI) {
    nextBackground.set(`url('${backgroundURI}')`);
  }

  export function setToDefaultBackground() {
    nextBackground.set(DEFAULT_BACKGROUND);
  }

  function handleNextBgFadeDone() {
    // Officially make nextBackround the background.
    nextBackground.update(bg => {
      background.set(bg);
      return '';
    });
  }
</script>

<div class="background" style="--dim-amount: {$dimAmount};">
  <div class="background-image" style="--background: {$background};"></div>

  {#if $nextBackground}
    <div
      class="background-image"
      style="--background: {$nextBackground};"
      transition:fade={{ duration: FADE_DURATION }}
      on:introend={handleNextBgFadeDone}
    ></div>
  {/if}
</div>

<style>
  .background {
    position: fixed;
    inset: 0;
    z-index: -1;
  }

  .background::after {
    content: '';

    position: fixed;
    inset: 0;

    background-color: #101010;
    opacity: var(--dim-amount);
  }

  .background-image {
    position: absolute;
    inset: 0;

    background: var(--background);
    background-position: center;
    background-size: cover;
  }
</style>
