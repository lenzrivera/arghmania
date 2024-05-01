<script>
  /**
   * @type {number[]}
   */
  export let divisions;

  export let selected;

  // export let selectedIndex = 0;
</script>

<label for="division">Division</label>
<select id="division" bind:value={selected}>
  {#each divisions as division}
    <option value={division}>{division}</option>
  {/each}
</select>

<style>
  label {
    margin-right: 0.25em;

    font-family: 'Libre Baskerville', serif;
    font-size: 1em;

    user-select: none;
  }

  select {
    color: #ddd;
    font-family: 'Libre Baskerville', serif;
    font-size: 1em;

    background-color: #7a7a7a;
    border-radius: 0.25rem;
  }
</style>
