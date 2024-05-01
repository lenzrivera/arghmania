<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import IconButton from './IconButton.svelte';

  export let metadata;
  export let selected;
  export let valid;
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="beatmap-item"
  class:invalid={!valid}
  class:selected
  role="button"
  on:click
>
  <div>
    <h2 class="major-line">{metadata.title}</h2>
    <p class="minor-line">{metadata.artist}</p>

    {#if !valid}
      <p class="invalid-line">(Has errors; needs editing!)</p>
    {/if}
  </div>

  <div class="action-list">
    <IconButton
      icon="Edit"
      disabled={!selected}
      on:click={() => dispatch('edit')}
    />
    <IconButton
      icon="Delete"
      disabled={!selected}
      on:click={() => dispatch('delete')}
    />
  </div>
</div>

<style>
  .beatmap-item {
    padding: 1em 1.5em;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3.5rem;

    font-family: 'Libre Baskerville', serif;

    background: linear-gradient(0deg, #777, #ddd);
    border-radius: 0.25rem;
    opacity: 0.59;

    transition:
      margin 150ms ease-in-out,
      opacity 150ms ease-in-out,
      scale 150ms ease-in-out;

    user-select: none;
  }

  .beatmap-item:hover {
    opacity: 0.79;
  }

  .beatmap-item:active {
    filter: brightness(0.9);
  }

  .beatmap-item.invalid {
    background: linear-gradient(0deg, #da7070, #eea5a5);
  }

  .beatmap-item.selected {
    opacity: 0.95;
    scale: 1.15;
    margin: 1rem 0;
  }

  .major-line {
    font-size: 1.2rem;
  }

  .minor-line {
    font-size: 0.95rem;
  }

  .invalid-line {
    margin-top: 0.2rem;
    font-size: 0.75rem;
    font-style: italic;
  }

  .action-list {
    display: flex;
  }
</style>
