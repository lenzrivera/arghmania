<script>
  import Background from '../components/Background.svelte';
  import LabelButton from '../components/LabelButton.svelte';
  import { currentView } from './currentView';
  import GameView from './GameView.svelte';
  import HomeView from './HomeView.svelte';

  /**
   * @type {?import('../beatmap/Beatmap').Beatmap}
   */
  export let beatmapReference = null;

  /**
   * @type {number}
   */
  export let score;

  /**
   * @type {number}
   */
  export let accuracy;

  /**
   * @type {number}
   */
  export let maxCombo;

  /**
   * @type {number}
   */
  export let misses;

  /**
   * @type {number}
   */
  export let unstableRate;

  $: roundedAccuracy = (Math.round(accuracy * 100) / 100).toFixed(2);
  $: roundedScore = Math.round(score).toString().padStart(7, '0');
  $: roundedUR = (Math.round(unstableRate * 100) / 100).toFixed(2);

  function backToMenu() {
    currentView.set(HomeView, {});
  }

  function restartMap() {
    currentView.set(GameView, { beatmap: beatmapReference });
  }
</script>

<Background />

<div class="results-view">
  <div class="results-box">
    <div class="meta">
      <h2>{beatmapReference.meta.title}</h2>
      <p>{beatmapReference.meta.artist}</p>
    </div>

    <div class="stats">
      <p>Score: {roundedScore}</p>
      <p>Accuracy: {roundedAccuracy}%</p>
      <p>Max Combo: {maxCombo}×</p>
      <p>Misses: {misses}</p>
      <p>UR: {roundedUR}</p>
    </div>

    <div class="actions">
      <LabelButton icon="restart_alt" on:click={restartMap}>Restart</LabelButton
      >
      <LabelButton icon="arrow_back" on:click={backToMenu}>Back</LabelButton>
    </div>
  </div>
</div>

<style>
  .results-view {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: 'Libre Baskerville', serif;
  }

  .results-box {
    width: min(80vw, 25rem);
    padding: 2.5em 1.5em;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;

    background: linear-gradient(0deg, #777777bf, #ddddddbf);
    border-radius: 0.25rem;

    user-select: none;
  }

  .meta {
    text-align: center;
    line-height: 2em;
    margin-bottom: -1em;
  }

  .stats {
    line-height: 1.8em;
  }

  .actions {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 1rem;
  }
</style>
