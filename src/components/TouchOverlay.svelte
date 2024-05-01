<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  /**
   * @param {number} trackIndex
   */
  function holdTrack(trackIndex) {
    dispatch('trackhold', trackIndex);
  }

  /**
   * @param {number} trackIndex
   */
  function releaseTrack(trackIndex) {
    dispatch('trackrelease', trackIndex);
  }
</script>

<div class="touch-overlay">
  <div
    role="button"
    on:touchstart={() => holdTrack(0)}
    on:touchend={() => releaseTrack(0)}
  ></div>
  <div
    role="button"
    on:touchstart={() => holdTrack(1)}
    on:touchend={() => releaseTrack(1)}
  ></div>
  <div
    role="button"
    on:touchstart={() => holdTrack(2)}
    on:touchend={() => releaseTrack(2)}
  ></div>
  <div
    role="button"
    on:touchstart={() => holdTrack(3)}
    on:touchend={() => releaseTrack(3)}
  ></div>
</div>

<style>
  .touch-overlay {
    position: fixed;
    inset: 0;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
