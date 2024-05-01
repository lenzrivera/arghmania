<script>
  export let icon;
</script>

<button on:click>
  <span class="material-symbols-outlined">{icon}</span>
  <slot />
</button>

<style>
  button {
    padding: 0.25em 0.5em;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    font-family: 'Libre Baskerville';
    font-size: 1rem;

    background: linear-gradient(0deg, #aaa, #eee);
    border-radius: 0.25rem;
    border: none;

    transition: filter 70ms ease-in-out;

    user-select: none;
  }

  button:hover {
    filter: brightness(1.1);
  }

  button:active {
    filter: brightness(0.8);
  }

  button > span {
    font-size: 1.2em;
  }
</style>
